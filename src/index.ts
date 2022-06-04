import * as _ from 'lodash';
import {assets} from './asset_loader'
function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  let canvas = document.getElementById('canvas') as
  HTMLCanvasElement;
let context = canvas.getContext("2d");
let asset = new assets();
let animation_test = 0;
let animation_test_limit = 10;
let x_pos = 0;
let loop = ()=>{
    if(animation_test == animation_test_limit)
    {
        x_pos+=64;
            
        if(x_pos==1216)
        {
            x_pos=0;
        }
        animation_test=0;
    }
    else
    {
        animation_test++;
    }
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(asset.builder_with_rock, x_pos,0,64,64,0,0,64,64);
    window.requestAnimationFrame(loop)
}
    window.requestAnimationFrame(loop)
 return element;
}
document.body.appendChild(component());