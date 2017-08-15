import React, { Component }  from 'react'
import ClipItem from 'components/clip_item.js'

import './edit.scss'

export default  class Edit extends Component {
    constructor(props) {
        super(props)   
        this.state={
            c_index:0 , 
            show_clip:0,    // 截图
            show_small:0,
            show_code:0,
            orgin_img:'',
            clip_img:''
        }
    }
 
    //二维码clip
    loadImageFile() {
        let oFReader = new FileReader()
        let rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        let _this = this;
        oFReader.onload = function (oFREvent) {
            _this.setState({
                orgin_img:oFREvent.target.result,
                show_clip:1
            })
        };
        
        let oFile = document.getElementById("imageInput").files[0];
        if (!rFilter.test(oFile.type)) { alert("You must select a valid image file!");
            return; }
        oFReader.readAsDataURL(oFile);
    }
   
    render() {
        return (
            <div ref="edit_bg" className="edit_bg">
                <h1>图片裁剪</h1>
                <img className="clipImg" src={this.state.clip_img}/>
                {
                    this.state.show_clip?
                    <ClipItem orgin={this.state.orgin_img} onClip={(img)=>this.setState({clip_img:img,show_code:1,show_clip:0,small_code:0})} />
                    :null
                }
                <div className="upload_btn">
                    <span> + </span>
                    <input id="imageInput" type="file" name="myPhoto" accept="image/*" capture="camera" onChange={this.loadImageFile.bind(this)} />
                </div>
            </div>
        )
    }       
}
