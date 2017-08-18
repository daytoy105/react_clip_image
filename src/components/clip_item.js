import React,{ Component }  from 'react'
import Hammer from './hammer.js'
import './clip_item.scss'
export default class  ClipItem extends Component {
    constructor(props) {
        super(props)   
        this.state={
            tx:0,
            ty:0,
            lx:0,
            ly:0,
            scale:1,
            show_clip:1
        }
    }

    componentDidMount() {
        let canvas = document.getElementById('canvas_clip')
        let ctx = canvas.getContext('2d')
        canvas.width = 261;
        canvas.height = 261;
        let img = this.refs.uploadPreview;
        ctx.drawImage(img, 60, 203, canvas.width, canvas.height)
        console.log('img',img, canvas.toDataURL())
        //this.refs.uploadPreview.src = canvas.toDataURL()
    }

    handlePan(e) {
        e.preventDefault()
        let tx = this.state.lx + e.deltaX;
        let ty = this.state.ly + e.deltaY;
        this.setState({
            tx: tx,
            ty: ty,
        })
        if (e.isFinal) {
            this.setState({
                lx: tx,
                ly: ty,
            })
        }
        let value = [
            'translate3d(' + tx + 'px, ' + ty + 'px, 0)',
            'scale(' + this.state.scale + ', ' + this.state.scale + ')'
        ];
        value = value.join(" ");
        this.refs.uploadPreview.style.webkitTransform = value;
    }
    handleZoom(e){
        let scale = this.state.scale
        scale += e.deltaY/1000
        /*if(scale<0){
            return false
        }*/
        this.setState({
            scale:scale
        })
        let value = [
            'translate3d(' + this.state.lx + 'px, ' + this.state.ly + 'px, 0)',
            'scale(' + scale + ', ' + scale + ')'
        ];
        value = value.join(" ");
        
        this.refs.uploadPreview.style.webkitTransform = value;
       
    }

    saveClip() {
        let canvas = document.getElementById('canvas_clip')
        let ctx = canvas.getContext('2d')
        canvas.width = 261;
        canvas.height = 261;
        let tx = 60 - this.state.tx;
        let ty = 203 - this.state.ty;
        let img = this.refs.uploadPreview;
        let pw = img.offsetWidth
        let ph = img.offsetHeight
        ctx.drawImage(img, tx, ty, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        console.log( img, tx, ty,  pw*this.state.scale, ph*this.state.scale, canvas.width, canvas.height)
        this.props.onClip(canvas.toDataURL())
    }

    render() {
        return (
            <div style={{display:this.state.show_clip?'block':'none'}}>
                <canvas id="canvas_clip" style={{display:'none'}}></canvas>
                <div id="clipArea">
                    <div ref='photoclip'>
                        <img ref="uploadPreview" id="uploadPreview" src={require("images/timg.jpg")}/>
                    </div>
                    <div className="photo-clip-mask" >
                        <div className="photo-clip-area" ></div>
                    </div>
                    <Hammer onPan={this.handlePan.bind(this)}  direction='DIRECTION_ALL' onWheel={this.handleZoom.bind(this)}>
                        <div className="photo-clip-area"></div>
                    </Hammer>
                </div>
                <div className="clipBtn">
                    <img src={require("images/code_cancel.png")} className="code_cancel" onClick={()=>this.setState({show_clip:0})}/>
                    <img src={require("images/xian_ok.png")} className="code_ok" id="code_ok" onClick={this.saveClip.bind(this)} />
                </div>
                
            </div>
        )
    }       
}
 