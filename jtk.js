var jtk;
jtk = (function(){
	var c;
	var canvas;
	var cd = new Array();
	
	function jtk(str){
		canvas = document.getElementById(str);        
		c = canvas.getContext('2d');
		canvas.addEventListener("click",clickEvent,false);
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
	Positioning = {
		hbox: {
			children : [{x:0,y:0}],
			next : function(width){
					ch = this.children;
					ch.push({x:ch[ch.length-1].x+width,y:0});
					return (ch[ch.length-2]);
		}},
		vbox: {
			children : [{x:0,y:0}],
			next : function(height){
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
		};
		
	// simple button	
	jtk.prototype.Button = function(p,s){
		var width,height;	
		var fontSize = 12;
		var vPad = 10;
		var hPad = 15;

		c.font = (fontSize)+"px Arial";
		//var pos = Positioning.hbox.next(c.measureText(p.label).width+(hPad*2));
		var pos = Positioning.vbox.next(fontSize+(vPad*2));
        
		x = pos.x;
		y = pos.y;
		
		if (s==undefined){
			this.height = fontSize + (vPad*2);
    		var grd = c.createLinearGradient(x, y+10,x, y+this.height);
    		grd.addColorStop(0, "#fff"); // white
    		grd.addColorStop(1, "#e5e5e5"); // grey
    		c.fillStyle = grd;
    		c.beginPath();
			this.width = c.measureText(p.label).width + (hPad*2);
			
    		c.rect(x, y, this.width, (fontSize+(vPad*2))); 
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