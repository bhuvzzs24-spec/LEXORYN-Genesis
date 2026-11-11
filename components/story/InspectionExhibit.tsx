'use client';

import {useCallback,useEffect,useId,useRef,useState,type CSSProperties,type PointerEvent} from 'react';
import {X} from 'lucide-react';
import type {StoryHotspot,StoryScene} from '@/data/story';
import styles from './InspectionExhibit.module.css';

export interface InspectionMedia {
  src:string;
  width:number;
  height:number;
  kind:'generated'|'concept-reference'|'photographic-detail';
  /** Normalized source rectangle for one object in an original transparent atlas. */
  crop?:{x:number;y:number;width:number;height:number};
  transparent?:boolean;
}
export interface InspectionExhibitProps {
  scene:Pick<StoryScene,'id'|'hotspots'|'palette'>;
  objectMedia?:Readonly<Record<string,InspectionMedia>>;
  reducedMotion:boolean;
  includeProvidedDetails?:boolean;
  disabled?:boolean;
  /** Whole-item raycast hover supplied by the independent R3F object layer. */
  externalHoverId?:string|null;
  /** The same image object is already present and lifted inside the 3D scene. */
  objectAlreadyInScene?:boolean;
  onSelect?:(hotspot:StoryHotspot|null)=>void;
}
interface Selection {sceneId:number;id:string;}
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
const same=(a:Selection|null,b:Selection|null)=>!!a&&!!b&&a.sceneId===b.sceneId&&a.id===b.id;
const current=(selection:Selection|null,sceneId:number)=>selection?.sceneId===sceneId?selection:null;
const emptyMedia:Readonly<Record<string,InspectionMedia>>={};

/** Still-image objects, presented with an honest optical lift rather than a false 3D-model claim. */
export default function InspectionExhibit({scene,objectMedia=emptyMedia,reducedMotion,includeProvidedDetails=false,disabled=false,externalHoverId=null,objectAlreadyInScene=false,onSelect}:InspectionExhibitProps){
  const [hovered,setHovered]=useState<Selection|null>(null);
  const [focused,setFocused]=useState<Selection|null>(null);
  const [pinned,setPinned]=useState<Selection|null>(null);
  const [dismissed,setDismissed]=useState<Selection|null>(null);
  const [failedImages,setFailedImages]=useState<readonly string[]>([]);
  const panel=useRef<HTMLElement>(null),buttons=useRef<Record<string,HTMLButtonElement|null>>({});
  const descriptionId=useId(),titleId=useId(),selectionCallback=useRef(onSelect);
  const external=externalHoverId?{sceneId:scene.id,id:externalHoverId}:null;
  const selection=current(pinned,scene.id)??external??current(hovered,scene.id)??current(focused,scene.id);
  const active=!disabled&&selection&&!same(selection,dismissed)?scene.hotspots.find(h=>h.id===selection.id)??null:null;
  const isPinned=!!active&&current(pinned,scene.id)?.id===active.id;
  const generated=active?objectMedia[active.id]:undefined;
  const allowed=generated&&(generated.kind!=='concept-reference'||includeProvidedDetails)&&!failedImages.includes(generated.src)?generated:undefined;
  const media:InspectionMedia|undefined=allowed??(active?.detailAsset&&includeProvidedDetails&&!failedImages.includes(active.detailAsset)?{src:active.detailAsset,width:1,height:1,kind:'concept-reference'}:undefined);
  const showMedia=!!media&&!objectAlreadyInScene;
  const crop=media?.crop;
  const cropWidth=clamp(crop?.width??1,.001,1),cropHeight=clamp(crop?.height??1,.001,1);
  const aspect=media?media.width*cropWidth/(media.height*cropHeight):1;
  const anchor=active?.position??[.5,.5];
  const projectedX=active?`var(--exhibit-${active.id}-x, ${anchor[0]*100}%)`:`${anchor[0]*100}%`;
  const projectedY=active?`var(--exhibit-${active.id}-y, ${anchor[1]*100}%)`:`${anchor[1]*100}%`;
  const stageStyle={
    '--focus-x':projectedX,'--focus-y':projectedY,
    '--lift-x':`clamp(22%, calc(${projectedX} ${anchor[0]<.5?'+':'-'} 16%), 78%)`,
    '--lift-y':`clamp(27%, calc(${projectedY} - 6%), 58%)`,
  } as CSSProperties;

  useEffect(()=>{selectionCallback.current=onSelect;},[onSelect]);
  useEffect(()=>()=>selectionCallback.current?.(null),[]);
  useEffect(()=>{onSelect?.(active);},[active,onSelect]);
  useEffect(()=>{if(externalHoverId)setDismissed(null);},[externalHoverId,scene.id]);
  const dismiss=useCallback(()=>{
    if(!active)return;
    setDismissed({sceneId:scene.id,id:active.id});setPinned(null);setHovered(null);
    buttons.current[active.id]?.focus({preventScroll:true});
  },[active,scene.id]);
  useEffect(()=>{
    if(!active)return;
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();dismiss();}};
    window.addEventListener('keydown',escape);
    return()=>window.removeEventListener('keydown',escape);
  },[active,dismiss]);

  function illuminate(event:PointerEvent<HTMLElement>){
    if(reducedMotion||!panel.current)return;
    const rect=event.currentTarget.getBoundingClientRect();
    const x=clamp((event.clientX-rect.left)/Math.max(rect.width,1),0,1),y=clamp((event.clientY-rect.top)/Math.max(rect.height,1),0,1);
    panel.current.style.setProperty('--tilt-x',`${(y-.5)*-7}deg`);
    panel.current.style.setProperty('--tilt-y',`${(x-.5)*9}deg`);
    panel.current.style.setProperty('--light-x',`${x*100}%`);
    panel.current.style.setProperty('--light-y',`${y*100}%`);
  }
  function resetLight(){
    if(!panel.current)return;
    panel.current.style.setProperty('--tilt-x','0deg');panel.current.style.setProperty('--tilt-y','0deg');
    panel.current.style.setProperty('--light-x','35%');panel.current.style.setProperty('--light-y','20%');
  }
  function hold(hotspot:StoryHotspot){
    const target={sceneId:scene.id,id:hotspot.id};
    if(same(current(pinned,scene.id),target)){setPinned(null);setDismissed(target);}
    else{setDismissed(null);setPinned(target);}
  }

  return <div className={`${styles.root} ${reducedMotion?styles.reduced:''}`} style={stageStyle} data-testid="inspection-exhibit" data-active-object={active?.id??''} data-pinned={isPinned} data-has-media={!!media} data-external-hover={externalHoverId??''} data-object-in-scene={objectAlreadyInScene} data-has-cutout={!!media&&(media.transparent??!!media.crop)} data-palette={scene.palette}>
    <div className={styles.spotlight} data-active={!!active} aria-hidden="true"/>
    {!disabled?scene.hotspots.map((hotspot,index)=>{
      const selected=active?.id===hotspot.id;
      return <button type="button" key={hotspot.id} ref={button=>{buttons.current[hotspot.id]=button;}} className={styles.target}
        style={{left:`var(--exhibit-${hotspot.id}-x, ${hotspot.position[0]*100}%)`,top:`var(--exhibit-${hotspot.id}-y, ${hotspot.position[1]*100}%)`}}
        data-testid={`hotspot-${hotspot.id}`} data-selected={selected} data-subdued={!!active&&!selected}
        aria-label={`Inspect ${hotspot.title}`} aria-pressed={current(pinned,scene.id)?.id===hotspot.id}
        aria-expanded={selected} aria-controls={selected?descriptionId:undefined}
        aria-describedby={selected?descriptionId:undefined}
        onPointerEnter={event=>{if(event.pointerType==='mouse'||event.pointerType==='pen'){setDismissed(null);setHovered({sceneId:scene.id,id:hotspot.id});}}}
        onPointerLeave={()=>{setHovered(value=>value?.id===hotspot.id?null:value);resetLight();}}
        onPointerMove={illuminate}
        onFocus={event=>{if(!(event.relatedTarget instanceof Element&&event.relatedTarget.closest(`.${styles.exhibit}`)))setDismissed(null);setFocused({sceneId:scene.id,id:hotspot.id});}}
        onBlur={()=>setFocused(value=>value?.id===hotspot.id?null:value)} onClick={()=>hold(hotspot)}>
        <span className={styles.reticle} aria-hidden="true"><i/><b>{String(index+1).padStart(2,'0')}</b><i/></span>
        <span className={styles.name}>{hotspot.title}</span>
      </button>;
    }):null}
    {active?<section key={`${scene.id}-${active.id}`} ref={panel} className={styles.exhibit} data-pinned={isPinned} data-has-media={showMedia} data-in-scene={objectAlreadyInScene} aria-labelledby={titleId} onPointerMove={illuminate} onPointerLeave={resetLight}>
      <div className={styles.objectDepth} aria-hidden="true">
        {media&&showMedia?<div className={styles.objectFrame} style={{aspectRatio:aspect,'--frame-aspect':aspect} as CSSProperties}>
          <img key={media.src} src={media.src} alt="" draggable={false}
            className={crop?styles.atlasObject:styles.singleObject}
            style={crop?{width:`${100/cropWidth}%`,height:`${100/cropHeight}%`,left:`${-clamp(crop.x,0,1-cropWidth)/cropWidth*100}%`,top:`${-clamp(crop.y,0,1-cropHeight)/cropHeight*100}%`}:undefined}
            onError={()=>setFailedImages(images=>images.includes(media.src)?images:[...images,media.src])}/>
        </div>:null}
        {showMedia?<span className={styles.groundShadow}/>:null}
      </div>
      <div className={styles.caption}>
        <span className={styles.category}>{active.category??'FIELD STUDY'}<i/>{isPinned?'FOCUS HELD':'SELECT TO HOLD'}</span>
        <h2 id={titleId}>{active.title}</h2>
        <p id={descriptionId}>{active.body}</p>
        {media?<small className={styles.imageType}>{media.kind==='concept-reference'?'NATIVE CONCEPT STUDY · STILL IMAGE':'LAYERED IMAGE STUDY · INTERACTIVE LIGHT'}</small>:null}
      </div>
      {isPinned?<button type="button" className={styles.close} onClick={dismiss} aria-label="Close inspection"><X size={16}/></button>:null}
    </section>:null}
    <span className={styles.screenReader} role="status" aria-live="polite">{active?`${active.title}. ${isPinned?'Inspection held. Press Escape to close.':'Select to hold this inspection.'}`:''}</span>
  </div>;
}
