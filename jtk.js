var jtk;
jtk = (function(){
	var c;
	var canvas;
	var width;
	var cd = new Array();
	
	function jtk(str){
		canvas = document.getElementById(str);        
		c = canvas.getContext('2d');
		canvas.addEventListener("click",clickEvent,false);
		this.width = canvas.width; 
		}	
	function clickEvent(e){
		for (child in cd){ 	
			// only works for rectangular objects	
			if ( ( (e.clientX - canvas.offsetLeft) > cd[child].x) &&  ( (e.clientX - canvas.offsetLeft) < (cd[child].x + cd[child].width)) && ( (e.clientY - canvas.offsetTop) > cd[child].y) &&  ( (e.clientY - canvas.offsetTop) < (cd[child].y + cd[child].height)) ){
				
				 cd[child].onclick();
				 }
			}
		}
		
	//positioning : move this into the main jtk object later
	jtk.prototype.Positioning = {
		hbox: {
			children : [{x:0,y:0}],
			create : function(numChildren,p){
					ch = this.children;
					ch[0].width = width = Math.floor(p.width / numChildren);
					ch[0].height = height = p.width;
					 
					for (i=0;i<numChildren-1;i++){
						ch.push({
							x : ch[ch.length-1].x + width,
							y : 0,
							width : width,
							height : height							
							});	
						}
					return this;	
					
				},
			getChild : function(num){
					return (this.children[num]);
				},
			get : function(num){
					return (this.children);
				}
		},
		vbox: {
			children : [{x:0,y:0}],
			add : function(height){
					ch = this.children;
					ch.push({x:0,y:ch[ch.length-1].y+height});
					return (ch[ch.length-2]);
		}},	
		absolute: {
			children : [{x:0,y:0}],
			add : function(height){
					ch = this.children;
					ch.push({x:0,y:ch[ch.length-1].y+height});
					return (ch[ch.length-2]);
		}}		
		};
		
	//jtk.Positioning().	
	
	// simple rectangle	
	jtk.prototype.Rectangle = function(p){	
		c.fillStyle = p.color;
		c.fillRect(p.x, p.y, p.width, p.height);
		return {x:p.x,y:p.y};
		};
		
	// simple button	
	jtk.prototype.Button = function(p,s){
		var width,height;	
		var fontSize = 12;
		var vPad = 10;
		var hPad = 15;

		c.font = (fontSize)+"px Arial";

		//var pos = this.Positioning.hbox.add(p.position);
		//var pos = this.Positioning.hbox.add(fontSize+(vPad*2));
        
		x = p.position.x;
		y = p.position.y;
		
		if (s==undefined){
			this.height = fontSize + (vPad*2);
			//this.height = p.position.height;
    		var grd = c.createLinearGradient(x, y+10,x, y+this.height);
    		grd.addColorStop(0, "#fff"); // white
    		grd.addColorStop(1, "#e0e0e0"); // grey
    		c.fillStyle = grd;
    		c.beginPath();
			this.width = c.measureText(p.label).width + (hPad*2);
			//this.width = p.position.width;
			
    		c.rect(x, y, this.width, this.height); 
			// fontsize is the same as height so button height is fontSize + vertical padding *2
			c.fill();
			c.lineWidth = 0.5;
			c.strokeStyle = "#aaa";
			c.stroke();			
			c.fillStyle = "#666666";
    		c.fillText(p.label,x + hPad, y + fontSize + vPad);
			
		}
		else{
			c.fillStyle = s.backgroundColor;
			c.fillRect(x, y, s.width, s.height);
			c.font = (s.fontSize)+"px Arial";
			c.fillStyle = s.color;
    		c.fillText(p.label,x, y + (s.height+s.fontSize)/2);
			
			}
		p.width = this.width;
		p.x = x;
		p.y = y;
		p.height = this.height;
		cd.push(p);
		};	
				
return jtk;
})(window);