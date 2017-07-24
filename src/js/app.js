var eventBus=new Vue()
Vue.component("my-header",{
	props:{
		close:{

		},
		ok:false
	},
	data(){
		return {
			close:false,
			searchVal:'',
			tip:true,
			data_list:[],
			detail:"取消"
		}
	},
	template:`<div>
				<header class="header">
					<div class="search_box">
						<p><span class="iconfont" @click="search_keyUp">&#xe62f;</span><input type="text" 
						v-model="searchVal" @focus="change" @keyup="search_keyUp"><span><b v-if="close" 
						@click="valClose">x</b></span></p>
						<span class="finish" v-if="close" @click="closeFn(detail)">{{detail}}</span>
					</div>
				</header>
				<p class="tip" v-if="tip">无显示内容</p>
			   </div>
				`,
	methods:{
		change:function(){
			this.close=true;
		},
		closeFn:function(i){
			if(i=="取消"){
				this.close=false;
				this.data_list=[];
				this.searchVal=""
			}
			if(i=="完成"){
				eventBus.$emit("ok",true)
			}
		},
		valClose:function(){
			this.searchVal="";
			this.data_list=[];
			this.detail="取消"
		},
		search_keyUp:function(){
			axios.get("data/data.json").then((data)=>{
				this.data_list=data.data.data;
				this.data_list = []
				var newData=[]
				data.data.data.forEach((i)=>{
					this.data_list=data.data.data.filter((value)=>{
						if(value.name.indexOf(this.searchVal)!=-1){
							return value.name.indexOf(this.searchVal)!=-1;
						}	
					})
				})
				if(this.data_list.length==0){
					this.tip=true;
				}else{
					this.tip=false;
				}
				if(this.searchVal==""){
					this.data_list=[];
					this.detail="取消"
				}
			})
		}		
	},
	mounted:function(){
		eventBus.$on("detail",(data)=>{
			this.detail=data;
		})

	},
	watch:{
		data_list:function(a,b){
			eventBus.$emit("sendData",a)
		}	
		
	}

})
var mylist={
	props:{
		searchVal:{
			type:String,
			required:true
		},
		data_list:[],
		detail:{
			type:String,
			required:true
		},
		ok:false
	},
	data(){
		return {
			state:false
		}
	},
	template:`<div class="main">
				<ul>
					<li v-for="x in data_list"><b :class={checked:x.state} 
					@click="addBg(x)"></b> <span>{{x.name}} {{x.dept_name}} 
					{{x.role_name}}</span></li>
				</ul>
				<transition>
					<p class="ok" v-if="ok">添加成功</p>
				</transition>
				
			</div>`,
	mounted:function(){
		eventBus.$on("sendData",(data)=>{
			this.data_list=data;
		})	
		eventBus.$on("ok",(ok)=>{
			this.ok=ok;
			setTimeout(()=>{
				this.ok=false;
			},1500)
		})	

	},
	methods:{
		addBg:function(x){
			x.state=!x.state;
			var stateArr=[]
			this.data_list.forEach(function(v){
				if(v.state==true){
				 	stateArr.push(v.state)
				 }
			})
			if(stateArr.length>0){
				eventBus.$emit("detail","完成")
			}else{
				eventBus.$emit("detail","取消")
			}
		}
	}
}
new Vue({
	el:".wrap",
	data:{
		close:false,
		right:true,
		tip:false,
		data_list:{},
		ok:false
	},
	components:{
		'my-list':mylist
	}
})
