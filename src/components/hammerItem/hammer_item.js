import React,{ Component }  from 'react'
import Hammer from 'react-hammerjs'
import './hammer_item.scss'
export default class HammerItem extends Component {
    constructor(props) {
        super(props)   
        this.state={
            aimgs:this.props.item,
            i:this.props.i,
            nohammer:0,
            value:'',
            istool:this.props.imgtool,
            close:0,
        }
    }

    componentDidMount() {
        this.updateElement(this.props.i)
        if(this.props.item.reversal){
            this.handleReversal(this.props.i)
        }
    }
    subImg(i,e){
        console.log('hammer item sub :' ,i)
        this.props.SubItem(i);
    } 

    handlePan(i,e){    
        this.props.onSaveImgTools(i)
        e.preventDefault()
        if(!this.state.nohammer && this.props.item.imgtools){
            let tx = this.state.aimgs.last_x+e.deltaX;
            let ty = this.state.aimgs.last_y+e.deltaY;
            let tmp = this.state.aimgs;
            tmp.translate_x = tx
            tmp.translate_y = ty
            this.setState({
                aimgs:tmp
            })
            if (e.isFinal) {
                tmp.last_x = tx
                tmp.last_y = ty
                this.setState({
                    aimgs:tmp
                })
            }
            this.updateElement(i)
        }
        
    }
    handleReversal(i){
        this.setState({nohammer:1})
        let tmp = this.state.aimgs;
        tmp.reversal = !tmp.reversal
        this.setState({
            aimgs:tmp
        })
        let a = this.refs[`id${i}`].firstChild.getAttribute('scalex')
        if(!a){
            a=1;
            this.refs[`id${i}`].firstChild.setAttribute('scalex','1')
        }
        this.refs[`id${i}`].firstChild.style.webkitTransform='scaleX('+(a*-1)+')'
        this.refs[`id${i}`].firstChild.setAttribute('scalex',(a*-1))
    }
    handlePinch(i,e){
        console.log(e)
    }
    handleRotate(i,e){
        e.preventDefault()
        console.log('rotate')
        let tmp = this.state.aimgs;
        if (e.type == 'rotatestart') {
            tmp.initAngle = this.state.aimgs.angle || 0;
        }
        //tmp.rz = 1
        tmp.angle = initAngle + e.rotation
        this.setState({
            aimgs:tmp
        })
        //let value='rotate3d(' + tmp.rx + ',' + tmp.ry + ',' + tmp.rz + ',' + tmp.angle + 'deg)'
        //this.refs[`id${i}`].style.transform = value;
    }

    handleRotateStart(i,e){
        this.setState({nohammer:1})
        let tmp = this.state.aimgs;
        // (获得物体的中心点坐标 a(x,y))
        tmp.orgin.x= tmp.l+tmp.last_x +this.refs[`id${i}`].offsetWidth/2;
        tmp.orgin.y= tmp.t+tmp.last_y +this.refs[`id${i}`].offsetHeight/2;
        console.log('left ',tmp.l+tmp.last_x ,'width',this.refs[`id${i}`].offsetWidth, this.refs[`id${i}`].offsetWidth*tmp.scale/2)
        console.log('top', tmp.t+tmp.last_y,'height',this.refs[`id${i}`].offsetHeight*tmp.scale/2)
        console.log('原点坐标：',tmp.orgin.x, tmp.orgin.y)
        // (获得初始旋转时的 坐标c(x0,y0) )
        tmp.editRotate.x0=e.touches[0].pageX;
        tmp.editRotate.y0=e.touches[0].pageY;
        //console.log('初始旋转坐标：',e.touches[0])
        //tmp.rz = 1
        tmp.initAngle = this.state.aimgs.angle
        tmp.initScale = this.state.aimgs.scale
        this.setState({
            aimgs:tmp
        })
        e.preventDefault();
    }   

    handleRotateMove(i,e){
        let tmp = this.state.aimgs;
        let a,b,c;
        let k=1;
        let A={x:0,y:0};
        let C={x:0,y:0};
        let D={x:0,y:0};

        A.x=tmp.editRotate.x0
        A.y=tmp.editRotate.y0

        C.x=e.touches[0].pageX
        C.y=e.touches[0].pageY

        D.x=tmp.orgin.x
        D.y=tmp.orgin.y

        /*  缩放比例 =  CD / AD  ,   求 CD ,AD  , 两点间的距离公式  Math.sqrt 平方根   Math.pow(x,y)   x的 y 次幂  */
        let scale=tmp.initScale*(Math.sqrt(Math.pow((C.x-D.x),2)+Math.pow((C.y-D.y),2))/(Math.sqrt(Math.pow((A.x-D.x),2)+Math.pow((A.y-D.y),2))))
        //console.log('initScale',tmp.initScale)
        
        /******判断 旋转是 顺时针 or 逆时针 *******/
        //  利用矢量叉积判断
        if((A.x-D.x)*(C.y-D.y)-(A.y-D.y)*(C.x-D.x)>=0){
            k=1;
        }else{
            k=-1;
        }
        /****
        a  (AC的长)
        b  (变化后的 CD的长)
        c  (初始的 AD 的长 )
        求CD与AD ac的夹角 a
        cosa = c*c+b*b-a*a)/(2*b*c)
        a = cosa * 180/ Math.PI * k
        *****/
        a=Math.sqrt(Math.pow((C.x-A.x),2)+Math.pow((C.y-A.y),2))
        b=Math.sqrt(Math.pow((C.x-D.x),2)+Math.pow((C.y-D.y),2))
        c=Math.sqrt(Math.pow((A.x-D.x),2)+Math.pow((A.y-D.y),2))
        let angle = tmp.initAngle + Math.acos((c*c+b*b-a*a)/(2*b*c))*180/Math.PI*k;

        tmp.angle= angle
        tmp.scale= scale
        this.setState({
            aimgs:tmp
        })
        //console.log('move angle', angle ,'move scale',scale)
        this.updateElement(i)
        e.preventDefault();   
    }
    updateElement(i){
        let value = [
            'translate3d(' + this.state.aimgs.translate_x + 'px, ' + this.state.aimgs.translate_y + 'px, 0)',
            'scale(' + this.state.aimgs.scale + ', ' + this.state.aimgs.scale + ')',
            'rotate3d(' + 0 + ',' + 0+ ',' + 1 + ',' + this.state.aimgs.angle + 'deg)'
        ];
        //'rotate3d(' + this.state.aimgs.rx + ',' + this.state.aimgs.ry + ',' + this.state.aimgs.rz + ',' + this.state.aimgs.angle + 'deg)'
        value = value.join(" ");

        this.refs[`id${i}`].style.webkitTransform = value;
        this.refs[`id${i}`].style.mozTransform = value;
        this.refs[`id${i}`].style.transform = value;

        let val2 = 'scale('+1/this.state.aimgs.scale+')'
        if(this.props.item.type=='txt'){
            this.refs[`yd${i}`].style.transform = val2;
        }else{
            this.refs[`fz${i}`].style.transform = val2;
        }
        this.refs[`cd${i}`].style.transform = val2;
        this.refs[`rd${i}`].style.transform = val2;
        //$(myElement).css('box-shadow','0px 0px 0px '+1/transform.scale+'px #41af9d')
    }
    
    // 文本选择
    handleChange(i,e){
        this.setState({
            value:e.target.value
        })
    }

    handleImgTools(i,e){
        e.preventDefault()
        if(!this.state.close){
            this.props.onSaveImgTools(i)
        }
    }
    render() {
        let {item ,i} = this.props
        let options={
            recognizers: {
                pinch: { 
                    enable: true 
                },
                rotate: { 
                    enable: true 
                }
            }
        }
        return (
            <Hammer onPan={this.handlePan.bind(this,i)} onPinch={this.handlePinch.bind(this,i)} onRotate={this.handleRotate.bind(this,i)} options={options} direction='DIRECTION_ALL' onClick={this.handleImgTools.bind(this,i)}>
                <div ref={'id'+ i} id={'id'+ i} className="handle_img1" style={{position:'absolute',top:item.t+'px',left: item.l +'px',zIndex:100,boxShadow:item.imgtools?'0px 0px 0px 1px #41af9d':'none'}} onClick={this.handleImgTools.bind(this,i)}>
                    <img src={require(`images/${item.type=='txt'?'txt':'ico'}${item.i}.png`)} className="ico_img" onTouchStart={()=>this.setState({nohammer:0})}/>
                    <div ref="tools" style={{display:item.imgtools?'block':'none'}}>
                    {
                        item.type=='txt'?
                        <img ref={'yd'+i} src={require("images/edit_yidong.png")} className="edit_yidong" onTouchStart={()=>this.setState({nohammer:0})}/>
                        :
                        <img ref={'fz'+i} src={require("images/edit_fanzhuan.png")} className="edit_fanzhuan" onTouchStart={this.handleReversal.bind(this,i)}/>
                    }
                    <img ref={'cd'+i} src={require("images/edit_close.png")} className="edit_close" onClick={this.subImg.bind(this,i)} onTouchStart={()=>this.setState({nohammer:1,close:1})}/>
                    <img ref={'rd'+i} src={require("images/edit_rotate.png")}  className="edit_rotate" onTouchStart={this.handleRotateStart.bind(this,i)} onTouchMove={this.handleRotateMove.bind(this,i)}  />
                    </div>
                    {
                        item.type=='txt'?
                        <input type="text" ref={'input'+i} placeholder="文字输入" value={this.state.value} className={"input"+item.i} style={{color:this.props.tcolor}} onClick={()=>this.props.onSaveInput(i)} onChange={this.handleChange.bind(this,i)} onTouchStart={()=>this.setState({nohammer:1})}/>
                        :null
                    }
                </div>
            </Hammer>
        )
    }       
}
 