import React,{ Component }  from 'react'
import Hammer from 'react-hammerjs'
import './clip_item.scss'
export default class  ClipItem extends Component {
    constructor(props) {
        super(props)   
        this.state={
            tx:0,
            ty:0,
            lx:0,
            ly:0,
            show_clip:1
        }
    }
    componentDidMount() {
        let canvas=document.getElementById('canvas_clip')
        let ctx=canvas.getContext('2d')
        let img = this.refs.uploadPreview;
        let pw = img.offsetWidth
        let ph = img.offsetHeight
        canvas.width= img.offsetWidth;
        canvas.height=img.offsetHeight;
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        this.refs.uploadPreview.src = canvas.toDataURL()
        console.log('clip')
    }


    handlePan2(e){
        e.preventDefault()
        let tx = this.state.lx+e.deltaX;
        let ty =this.state.ly+e.deltaY;
        this.setState({
            tx:tx,
            ty:ty,
        })
        if (e.isFinal) {
            this.setState({
                lx:tx,
                ly:ty,
            })
        }
        let value =  'translate3d(' + tx + 'px, ' + ty + 'px, 0)'
        this.refs.photoclip.style.webkitTransform = value;
    }

    saveClip(){
        let canvas=document.getElementById('canvas_clip')
        let ctx=canvas.getContext('2d')
        canvas.width= 261;
        canvas.height=261;
        let tx = 60-this.state.tx;
        let ty = 203-this.state.ty;
        let img = this.refs.uploadPreview;
        ctx.drawImage(img,tx,ty,canvas.width,canvas.height,0,0,canvas.width,canvas.height);
        this.props.onClip(canvas.toDataURL())
    }

    handleChangCodeName(e){
        this.props.onCodeName(e.target.value)
    }

    render() {
        return (
            <div style={{display:this.state.show_clip?'block':'none'}}>
                <canvas id="canvas_clip" style={{display:'none'}}></canvas>
                <div id="clipArea">
                    <div ref='photoclip'>
                        <img ref="uploadPreview" id="uploadPreview" src={this.props.orgin}/>
                    </div>

                    <div className="photo-clip-mask" style={{position: 'absolute', left: '0px',top: '0px', width:' 100%', height: '100%' }}>
                        <div className="photo-clip-area" style={{position: 'absolute', left: '50%', top:' 50%', width: '261px', height: '261px', marginLeft:'-131.5px', marginTop:'-131.5px'}}></div>
                    </div>
                    <Hammer onPan={this.handlePan2.bind(this)}  direction='DIRECTION_ALL'>
                        <div className="photo-clip-area" style={{position: 'absolute', left: '50%', top: '50%', width: '261px', height: '261px', marginLeft:'-131.5px', marginTop:'-131.5px'}}></div>
                    </Hammer>
                </div>
                <div className="clipBtn">
                    <input className="code_name" placeholder="自定义二维码名称" onChange={this.handleChangCodeName.bind(this)} />
                    <img src={require("images/code_cancel.png")} className="code_cancel" onClick={()=>this.setState({show_clip:0})}/>
                    <img src={require("images/xian_ok.png")} className="code_ok" id="code_ok" onClick={this.saveClip.bind(this)} />
                </div>
                
            </div>
        )
    }       
}
 