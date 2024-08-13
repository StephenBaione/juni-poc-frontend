import {
	AnimationClip,
	BooleanKeyframeTrack,
	ColorKeyframeTrack,
	NumberKeyframeTrack,
	Vector3,
	VectorKeyframeTrack
} from 'three';

const azureVisemesCfg = require('../../services/cfg/azure_visemes_cfg.json')
const visemesIndexMap = azureVisemesCfg['VisemeIndexMap'];

var fps = 60

const lodash = require('lodash');

function modifiedKey(key) {

  if (["eyeLookDownLeft", "eyeLookDownRight", "eyeLookInLeft", "eyeLookInRight", "eyeLookOutLeft", "eyeLookOutRight", "eyeLookUpLeft", "eyeLookUpRight"].includes(key)) {
    return key
  }

  if (key.endsWith("Right")) {
    return key.replace("Right", "_R");
  }
  if (key.endsWith("Left")) {
    return key.replace("Left", "_L");
  }
  return key;
}

export function createAnimationFromInternal (visemes, morphTargetDictionary, bodyPart) {
  let finalAnimations = [];
  let morphTargetIndexToModifiedKey = {};

  let times = [];

  for (let _ = 0; _ < Object.keys(morphTargetDictionary).length; _++) {
    finalAnimations.push([]);
  }

  lodash.each(visemes, (viseme) => {
    const audioOffset = viseme.audio_offset;
    const animations = viseme.animation;

    animations.forEach((animation) => {
      const time = animation.time;
      const animationGroup = animation.animation_group;

      for (let i = 0; i < animationGroup.length; i++) {
        const shapeKeyItem = animationGroup[i];
        const shapeKey = shapeKeyItem.shape_key;
        let value = shapeKeyItem.value;

        const _modifiedKey = modifiedKey(shapeKey);

        if (! (_modifiedKey in morphTargetDictionary)) {continue}

        if (shapeKey === 'mouthShrugUpper') {
          value += 0.4;
        }

        const morphTargetIndex = morphTargetDictionary[_modifiedKey];
        if (!morphTargetIndexToModifiedKey[morphTargetIndex]) {
          morphTargetIndexToModifiedKey[morphTargetIndex] = _modifiedKey;
        }

        finalAnimations[morphTargetIndex].push(value);
      }

      times.push(time);
    });
  });

  let tracks = [];
  for (let i = 0; i < finalAnimations.length; i++) {
    const _modifiedKey = morphTargetIndexToModifiedKey[i];

    if (! (_modifiedKey in morphTargetDictionary)) {continue}

    const animation = finalAnimations[i];

    const track = new NumberKeyframeTrack(`${bodyPart}.morphTargetInfluences[${i}]`, times, animation);
    tracks.push(track);
  }

  const clip = new AnimationClip('animation', -1, tracks);
  return clip;
}

export function createAnimation (recordedData, morphTargetDictionary, bodyPart, fromInternal = false) {
  if (recordedData.length != 0) {
    let animation = []
    for (let i = 0; i < Object.keys(morphTargetDictionary).length; i++) {
      animation.push([])
    }
    let time = []
    let finishedFrames = 0
    recordedData.forEach((d, i) => {
        Object.entries(d.blendshapes).forEach(([key, value]) => {

          if (! (modifiedKey(key) in morphTargetDictionary)) {return};
          
          if (key == 'mouthShrugUpper') {
            value += 0.4;
          }

          animation[morphTargetDictionary[modifiedKey(key)]].push(value)
        });
        time.push(finishedFrames / fps)
        finishedFrames++

    })

    // console.log("-----animation", animation);

    let tracks = []

    let flag = false;
    //create morph animation
    Object.entries(recordedData[0].blendshapes).forEach(([key, value]) => {

      if (! (modifiedKey(key) in morphTargetDictionary)) {return};

      let i = morphTargetDictionary[modifiedKey(key)]
      
      // if (bodyPart === "HG_TeethLower") {

      //       if (flag === true)
      //         return;
            
      //       if(key === 'jawOpen') {
      //         let track2 = new NumberKeyframeTrack(`HG_TeethLower.morphTargetInfluences[${i}]`, time, animation[i])
      //         tracks.push(track2)
      //         flag = true
      //       }
      // } else {
        let track = new NumberKeyframeTrack(`${bodyPart}.morphTargetInfluences[${i}]`, time, animation[i])

        tracks.push(track)
  
      // }

      
      // if (key === "jawOpen") {
      //   let track2 = new NumberKeyframeTrack(`HG_TeethLower.morphTargetInfluences[${i}]`, time, animation[i])
      //   tracks.push(track2)
      //   console.log("----jawOpen Track", track2);
      // }
    });

    const clip = new AnimationClip('animation', -1, tracks);
    return clip
  }
  return null
}
