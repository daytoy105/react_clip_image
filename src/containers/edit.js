import React, { Component }  from 'react'
import HammerItem from 'components/hammerItem/hammer_item.js'
import ClipItem from 'components/clip/clip_item.js'
import DrawItem from 'components/draw/draw_item.js'

import './edit.scss'

export default  class Edit extends Component {
    constructor(props) {
        super(props)   
        this.state={
            edit:0,
            show_edit:0,
            uuid:0,
            aimgs:[],
            isblank:0,
            color2_arr:['#ff0f00','#a200ff','#1800ff','#00a8ff','#00ff30','#ffffff','#333333'],   // 文本图案
            c_index:0 , 
            show_clip:0,    // 截图
            show_small:0,
            show_code:0,
            orgin_img:'',
            clip_img:'',
            codeName:'二维码',
            showline:0,
            color_arr:['#ff752f','#ff0000','#eadc00','#00ea8f','#0058ea','#a000ea'],   // 涂鸦
            px_arr:[5,7.5,10,12.5,15,17.5],
            pen_color:0,
            pen_size:0,
            canvas_arr:[],
            canvas_heigth:0,
            iscanvas:0,
            issave:0,
            model:0
        }
    }

    componentDidMount() {
        
        // iframe 的高度设置
        let tb_height = this.state.model=='show'? 0: this.refs.topBar.offsetHeight
        let tc_height = this.state.model=='show'? 0: this.refs.tools_container.offsetHeight

        let heigth = document.body.clientHeight-parseInt(this.refs.tools_container.offsetHeight)-parseInt(tb_height);
        this.setState({canvas_heigth:heigth})

        let cw = document.body.clientWidth
        let ch = document.body.clientHeight
        let iframe = this.refs.art_content
        let iframe_con = this.refs.iframe_container
        iframe.style.height= ch+'px'
        iframe_con.style.height = ch *(cw/375) + tc_height +'px'
        iframe_con.style.marginTop =tb_height +'px'
        console.log(tb_height)
        
        let _this = this
        iframe.onload = function() {
            let frame_height = iframe.contentWindow.document.documentElement.scrollHeight;
            console.log(frame_height)
            iframe.style.height= frame_height+'px'
            iframe_con.style.height = frame_height *(cw/375) + tc_height+'px'
        }

    }

    // 添加图形
    addImg(i,type,e){
        this.setState({
            uuid: this.state.uuid +1         
        });
        console.log(this.state.uuid)
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        let data = {
            type:type,
            i:i,
            sort:this.state.uuid,
            t:Math.round(scrollTop + Math.random() * document.body.clientHeight / 2),
            l:Math.round(Math.random() *document.body.clientWidth   / 2),
            last_x:0,
            last_y:0,
            translate_x:0,
            translate_y:0,
            initScale:1,
            scale:1,
            initAngle:0,
            angle:0,
            editRotate:{x:0,y:0,x0:0,y0:0},
            orgin:{x:0,y:0},
            reversal:0,
            imgtools:0,
            tcolor:this.state.color2_arr[0],
            color:0
        }
        const nextKeys =this.state.aimgs.concat(data) ; 
        for(let i in nextKeys){
            nextKeys[i].imgtools =0
        }
        nextKeys[nextKeys.length-1].imgtools =1 
        this.setState({
            aimgs: nextKeys,
            isblank:1
        });
    }

    subImg(i){
        const nextKeys =this.state.aimgs
        nextKeys.splice(i,1)
        this.setState({
            aimgs: nextKeys   
        });
    }

    showImgTools(k){
        console
        let nextKeys = this.state.aimgs
        for(let i in nextKeys){
            nextKeys[i].imgtools = 0
        }
        nextKeys[k].imgtools = 1 
        this.setState({
            aimgs: nextKeys,
            isblank:1
        });
    }
    hideImgTools(){
        console.log('blank')
        let nextKeys = this.state.aimgs
        for(let i in nextKeys){
            nextKeys[i].imgtools = 0
        }
        this.setState({
            aimgs: nextKeys,
            isblank:0
        });
    }
   
    // 文本选择
    handleInput(i){
        this.setState({c_index:i})
        for(let i in this.state.color2_arr){
            this.refs['tcolor_'+i].className='pan'
        }
        this.refs['tcolor_'+this.state.aimgs[i].color].className='pan active'
    }
    handleChooseColor(i,e){
       let tmp = this.state.aimgs;
        tmp[this.state.c_index].tcolor = this.state.color2_arr[i]
        tmp[this.state.c_index].color = i
        this.setState({
            aimgs:tmp
        })
        for(let i in this.state.color2_arr){
            this.refs['tcolor_'+i].className='pan'
        }
        this.refs['tcolor_'+i].className='pan active'
    }

    // canvas 涂鸦
    handlePenColor(i,e){
        this.setState({pen_color:i})
        for(let i in this.state.color_arr){
            this.refs['pcolor_'+i].className='pan'
        }
        this.refs['pcolor_'+i].className='pan active'
        let strokeColor=this.state.color_arr[i]
        for(let i=0;i<6;i++){
           this.refs['color_box'+i].style.background=strokeColor
        }
    }
    handlePenSize(i,e){
        this.setState({pen_size:i})
        for(let i in this.state.color_arr){
            this.refs['psize_'+i].className='pan'
        }
        this.refs['psize_'+i].className='pan active'
    }
    handleCanvasToImage(val,scrolltop){
        let _data = this.state.canvas_arr ;
       /* let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        console.log(scrollTop)*/
        _data.push({
            img:val,
            scrollTop:scrolltop
        })
        this.setState({
            canvas_arr:_data,
            iscanvas:0
        })
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
    handleSave(i){
        this.setState({
            issave:1,
            //model:'show'
        })
        /*let formData = new FormData();
        formData.set('pid', this.props.params.pid);
        formData.set('config', this.refs.edit_container.innerHTML);
        console.log(typeof this.refs.edit_container.innerHTML)
        this.props.postData('http://one.lhyou.com/hutui/index.php?action=index&do=savepage', formData,'SaveArtConfig').then(res=>{
            console.log(res)
        })*/
        console.log(this.state.aimgs , this.state.canvas_arr, this.state.codeName)

    }
    render() {
        let imgs = [] , text=[];
        for(let i=1; i<33;i++){
            imgs.push(i)
        }
        for(let i=1; i<12;i++){
            text.push(i)
        }
        let _this = this;
        let imgs_ele = this.state.aimgs.map((item,i)=>(    ///**key : 保证 dom 的唯一性  删除时避免数据渲染错乱 **/
            <HammerItem key={item.sort} item = {item} i={i} imgtools={item.imgtools} SubItem={(subid)=>this.subImg(subid)} tcolor={item.tcolor} onSaveInput={(index)=>this.handleInput(index)}  onSaveImgTools={(id)=>this.showImgTools(id)}/>        
        ))

        return (
            <div ref="edit_bg" className="edit_bg">
                <div className="topBar" ref="topBar" style={{display:this.state.model?'none':'block'}}>
                    <a href="#">
                        <img src={require("images/back_arrows.png")} className="back_arrows" />
                    </a>
                    <p>文章内容</p>
                    {
                        this.state.issave?
                        <button className="save_btn" onClick={()=>this.setState({issave:0})}>保存</button>
                        :
                        <button className="veiw_btn" onClick={this.handleSave.bind(this)}>预览</button>
                    }
                </div>
                <div className="iframe_container" ref="iframe_container" onTouchStart={()=>console.log('canvas tap')} >
                    <iframe src={this.props.artLink} ref="art_content" id="art_content" frameBorder="0" className="art_content"></iframe>
                    <DrawItem height={this.state.canvas_heigth} show_edit={this.state.show_edit} iscanvas={this.state.iscanvas} pen_size={this.state.px_arr[this.state.pen_size]} pen_color={this.state.color_arr[this.state.pen_color]} line={this.state.showline} onSaveCanvas={(val,scrolltop)=>this.handleCanvasToImage(val,scrolltop)} onEditCanvas={()=>this.setState({iscanvas:1})}/>
                    <div className="edit_container" ref="edit_container">
                        <div className={`code ${this.state.show_small?'small_code':''}`} style={{display:this.state.show_code?'flex':'none'}}>
                            <div className="code_bg" onClick={()=>this.setState({show_small:!this.state.show_small})} ></div>
                            <div className="code_container">
                                <div className="two_code">
                                    <img src={this.state.clip_img}/>
                                </div>
                                <p>{this.state.codeName}</p>
                            </div>
                        </div>
                        {
                            this.state.canvas_arr.map((item,i)=>(
                                <img key={i} src={item.img} style={{position:'absolute',top:item.scrollTop+'px'}}/>
                            )) 
                        }
                        {imgs_ele}
                    </div>
                    <div className="blank" style={{display:this.state.isblank?'block':'none'}} onTouchStart={this.hideImgTools.bind(this)}></div>
                    <div className="mask_container" style={{display:this.state.model?'block':'none'}}></div>
                </div>

                {
                    this.state.show_clip?
                    <ClipItem orgin={this.state.orgin_img} onClip={(img)=>this.setState({clip_img:img,show_code:1,show_clip:0,small_code:0})}  onCodeName={(name)=>{this.setState({codeName:name})}}/>
                    :null
                }
                 
                <div className="tools_container" ref="tools_container" style={{display:this.state.model?'none':'block'}}>
                    <div className="tools" style={{display:this.state.show_edit?'block':'none'}}>
                        <div className="column column1" style={{display:this.state.show_edit==1?'block':'none'}}>
                            <div className="slide_box1">
                            {
                                imgs.map((e,i)=>(
                                    <div key={i} className="ico " onClick={this.addImg.bind(this,e)}><img src={require("images/ico"+e+".png")} /></div>
                                ))
                            } 
                            </div>
                        </div>
                        <div style={{display:this.state.show_edit==2?'block':'none'}}>
                            <div className="column column3 column3_3" >
                                <img src={require("images/xian.png")} />
                            </div>
                            <div className="column column3 column3_1">
                                <div className="slide_box3_2" ref="tcolor_box">
                                {
                                    this.state.color2_arr.map((col,i)=>(
                                        <div key={i} ref={"tcolor_"+i} id={"tcolor_"+i} className={`pan ${i==0?'active':''}`} onClick={_this.handleChooseColor.bind(_this,i)}><span className={"t_color"+(i+1)}></span></div>
                                    ))
                                }
                                </div>
                            </div>
                            <div className="column column3">
                                <div className="slide_box3">
                                {
                                    text.map((e,i)=>(
                                        <div key={i} className="txt "><img src={require("images/txt"+e+"_x.png")} onClick={this.addImg.bind(this,e,'txt')}/></div>
                                    ))
                                } 
                                </div>
                            </div>
                        </div>
                        <div style={{display:this.state.show_edit==3?'block':'none'}}>
                            <div className="column column4 column4_3">
                                <img src={require("images/xian.png")} />
                            </div>
                            <div className="column column4 column4_1">
                                <div className="slide_box4">
                                {
                                    this.state.color_arr.map((col,i)=>(
                                        <div key={i} ref={"pcolor_"+i} id={"pcolor_"+i} className={`pan ${i==0?'active':''}`} onClick={_this.handlePenColor.bind(_this,i)}><span className={`${this.state.showline?"color"+(i+1):"color"+(i+1)+"_1"}`}></span></div>
                                    ))
                                }
                                </div>
                            </div>
                            <div className="column column4 column4_2">
                                <div className="slide_box4">
                                {
                                    this.state.color_arr.map((col,i)=>(
                                        <div key={i} ref={"psize_"+i} id={"psize_"+i} className={`pan ${i==0?'active':''}`} onClick={_this.handlePenSize.bind(_this,i)}><i className={"px"+(i+1)}><em><b ref={"color_box"+i}></b></em>{(i+2)*5}</i></div>
                                    ))
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                    <img src={require("images/edit_question.png")} className="edit_question" />
                    <div className="edit_pan_container" style={{display:this.state.edit?'block':'none'}}>
                        <div className={`btn btn1 ${this.state.show_edit==1?'btn1_2':'btn1_1'}`} onClick={()=>this.setState({show_edit:1})}></div>
                        <div className="btn btn2 btn2_1">
                            <input id="imageInput" type="file" name="myPhoto" accept="image/*" capture="camera" onChange={this.loadImageFile.bind(this)}/>
                        </div>
                        <div className= {`btn btn1 ${this.state.show_edit==2?'btn3_2':'btn3_1'}`} onClick={()=>this.setState({show_edit:2})}></div>
                        <div className={`btn btn1 ${this.state.show_edit==3?this.state.showline?'btn4_2':'btn4_3':'btn4_1'}`} onClick={()=>this.setState({show_edit:3, showline:!this.state.showline, iscanvas:1})}></div>
                    </div>
                    {
                        this.state.edit?
                        <img src={require("images/edit_close2.png")} className="edit_close2" onClick={ ()=>this.setState({edit:0, show_edit:0}) }/>
                        :
                        <img src={require("images/edit_add.png")} className="edit_add" onClick={()=>this.setState({edit:1})}/>
                    }
                </div>
            </div>
        )
    }       
}
