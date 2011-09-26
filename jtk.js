var jtk;
jtk = (function () {
    var c;
    var canvas;
    var width;
    var cd = new Array();

    function jtk(str) {
        canvas = document.getElementById(str);
        c = canvas.getContext('2d');
        canvas.addEventListener("click", clickEvent, false);
        this.width = canvas.width;
		this.height = canvas.height;
    }

    function clickEvent(e) {
        for (child in cd) {
            // only works for rectangular objects	
            if (jtk.prototype.Rectangle({x:cd[child].x,y:cd[child].y,width:cd[child].width,height:cd[child].height, color:"#ffcc00"}).isPointInPath(e.clientX - canvas.offsetLeft,e.clientY - canvas.offsetTop)) {
			cd[child].onclick();
            }
        }
    }
	
	function getChild(p, index){
		// wtf???? 
		// this.add(p,index);
		 return (p.pos[index]);
		}
	function addChild(p, index){
		console.log(p);
		 return (p.pos[index]);
		}

    //positioning : move this into the main jtk object later
    jtk.prototype.Positioning = {
        a: [],
        hbox: {
            create: function (h) {
                numChildren = h.children;
                p = h.parent;
				index = h.index;			
				
                if (p.num == undefined) {
                    maxWidth = p.width;
                    maxHeight = p.height;
                    startX = 0;
                    startY = 0;
                } else {
                    maxWidth = p.pos[index].width;
                    maxHeight = p.pos[index].height;
                    startX = p.pos[index].x;
                    startY = p.pos[index].y;
                }
				width = Math.floor(maxWidth / numChildren);
                height = maxHeight;

                var e = {
                    type: 'hbox',
					hbox : this,
                    num: numChildren,
                    children: [],
                    pos: []
                }

                for (i = 0; i < numChildren; i++) {
                    obj = (i == 0) ? { x: startX  } : { x: e.pos[e.pos.length - 1].x + width };
					obj.y = startY;
					obj.width = width;
					obj.height = height;
                    e.pos.push(obj);
                    e.children.push({});
                }
                if (p.num == undefined) {
                    jtk.prototype.Positioning.a.push(e);
                } else {
                    p.children[index] = e;
                }
               // console.log(jtk.prototype.Positioning.a);
                return e;

            },
			// move this up to parent
            getChild: getChild,
			add: addChild
        },
        vbox: {
            create: function (v) {
                
				numChildren = v.children;
                p = v.parent;
				index = v.index;	
				
                if (p.num == undefined) {
                    maxWidth = p.width;
                    maxHeight = p.height;
                    startX = 0;
                    startY = 0;
                } else {
                    maxWidth = p.pos[index].width;
                    maxHeight = p.pos[index].height;
                    startX = p.pos[index].x;
                    startY = p.pos[index].y;
                }
				
                width = maxWidth;				
                height = Math.floor(maxHeight / numChildren);

                var e = {
                    type: 'vbox',
					vbox : this,
                    num: numChildren,
                    children: [],
                    pos: []
                }

                for (i = 0; i < numChildren; i++) {
                    obj = (i == 0) ? { y: startY } : { y: e.pos[e.pos.length - 1].y + height  };
					obj.x = startX;
					obj.width = width;
					obj.height = height;
                    e.pos.push(obj);
                    e.children.push({});
                }
                if (p.num == undefined) {
                    jtk.prototype.Positioning.a.push(e);
                } else {
                    p.children[index] = e;
                }
                return e;

            },
			// move this up to parent
            getChild: getChild 
        },
        absolute: {
            children: [{
                x: 0,
                y: 0
            }],
            add: function (height) {
                ch = this.children;
                ch.push({
                    x: 0,
                    y: ch[ch.length - 1].y + height
                });
                return (ch[ch.length - 2]);
            }
        }
    };

    //jtk.Positioning().	
    // simple rectangle	
    jtk.prototype.Rectangle = function (p) {
        c.beginPath();
		c.fillStyle = p.color;
        c.rect(p.x, p.y, p.width, p.height);
        return c;
    };

    // simple button	
    jtk.prototype.Button = function (p, s) {
        var width, height;
        var fontSize = 12;
        var vPad = 6;
        var hPad = 15;

        c.font = (fontSize) + "px Arial";
        x = p.position.x;
        y = p.position.y;

        if (s == undefined) {
            this.height = fontSize + (vPad * 2);
            //this.height = p.position.height;
            var grd = c.createLinearGradient(x, y + 10, x, y + this.height);
            grd.addColorStop(0, "#fff"); // white
            grd.addColorStop(1, "#e0e0e0"); // grey
            c.fillStyle = grd;
            c.beginPath();
            this.width = c.measureText(p.label).width + (hPad * 2);
            //this.width = p.position.width;
            c.rect(x, y, this.width, this.height);
            // fontsize is the same as height so button height is fontSize + vertical padding *2
            c.fill();
            c.lineWidth = 0.5;
            c.strokeStyle = "#aaa";
            c.stroke();
            c.fillStyle = "#666666";
            c.fillText(p.label, x + hPad, y + fontSize + vPad);

        } else {
            c.fillStyle = s.backgroundColor;
            c.fillRect(x, y, s.width, s.height);
            c.font = (s.fontSize) + "px Arial";
            c.fillStyle = s.color;
            c.fillText(p.label, x, y + (s.height + s.fontSize) / 2);

        }
        p.width = this.width;
        p.x = x;
        p.y = y;
        p.height = this.height;
        cd.push(p);
		console.log(p);
		return this;
    };
	
	/* 
	Display Label Widget on Canvas
	*/
	jtk.prototype.Label = function (p, s) {
		s = (typeof s == "undefined")? 'defaultValue' :s
		console.log(c);
		c.beginPath();
		font = "Arial";
		color = (s.color)? s.color : "black" ;
		size = (s.size)? s.size : 10;
		c.font = size + ' ' + font;
		c.fillStyle = color;
		c.fillText(p.text, p.position.x, p.position.y + size);
	};

    return jtk;
})(window); 