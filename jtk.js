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
        canvas.addEventListener("mousedown", clickEvent, false);
      	canvas.addEventListener("mousemove", mouseOverEvent, false);
        canvas.addEventListener("mouseup", clickEvent, false);
        this.width = canvas.width;
        this.height = canvas.height;
    }

    function clickEvent(e) {
        for (child in cd) {
            // only works for rectangular objects	
            if (jtk.prototype.Rectangle(cd[child].up,null, true).isPointInPath(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)) {
                if (e.type == 'mousedown') {
                    jtk.prototype.Rectangle(cd[child].down,cd[child].label, false);
                }
                if (e.type == 'mouseup') {					
                    jtk.prototype.Rectangle(cd[child].up,cd[child].label, false);
                    cd[child].onclick();
                }

            }
        }
    }

    function mouseOverEvent(e) {
        canvas.style.cursor = 'default';
        for (child in cd) {
            // only works for rectangular objects	
            if (jtk.prototype.Rectangle(cd[child].up,null, true).isPointInPath(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)) {
                canvas.style.cursor = 'pointer';
            }
        }
    }

    function getChild(p, index) {
        // wtf???? 
        //console.log(jtk.prototype.Positioning.a);
        return (p.pos[index]);
    }

    function addChild(p, index) {
        //console.log(this.children);
        return (p.pos[index]);
    }

    jtk.prototype.create = function (type, p, s) {
        switch (type) {
        case "hbox":
            return jtk.prototype.Positioning.hbox.create(p, s);
            break;
        case "vbox":
            return jtk.prototype.Positioning.vbox.create(p, s);
            break;
        case "label":
            p.parent.children[p.index] = this.Label(p.parent.pos[p.index], s);
            break;
        case "button":
            this.Button(p.parent.pos[p.index], s);
            break;
        }
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
                    hbox: this,
                    num: numChildren,
                    children: [],
                    pos: [],
                    attach: function () {}
                }

                for (i = 0; i < numChildren; i++) {
                    obj = (i == 0) ? {
                        x: startX
                    } : {
                        x: e.pos[e.pos.length - 1].x + width
                    };
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
                    vbox: this,
                    num: numChildren,
                    children: [],
                    pos: [],
                    attach: addChild
                }

                for (i = 0; i < numChildren; i++) {
                    obj = (i == 0) ? {
                        y: startY
                    } : {
                        y: e.pos[e.pos.length - 1].y + height
                    };
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


    // simple rectangle	
    jtk.prototype.Rectangle = function ( shape,label, test) {
		p = shape;
		s = label;
        c.beginPath();
        if (test) {
            c.lineWidth =0;
            c.rect(p.x, p.y, p.width, p.height);
        } else {
            c.clearRect(p.x - 2, p.y - 2, p.width + 3, p.height + 3);
            c.rect(p.x, p.y, p.width, p.height);
            if (p.fill) {
                c.fillStyle = p.fill;
                c.fill();
            }
            if (p.border) {
                c.lineWidth = p.border;
                c.strokeStyle = p['border-color'];
                c.stroke();
                c.closePath();
            }
			
			if (s){
				// fontsize is the same as height so button height is fontSize + vertical padding *2
				c.fillStyle = "#666666";
				c.fillText(s.text, p.x + s.hPad, p.y + s['font-size'] + s.vPad);
			}
        }
        return c;
    };

    // simple button	
    jtk.prototype.Button = function (p, s) {
        var width, height;
        var fontSize = 12;
        var vPad = 6;
        var hPad = 15;

        c.font = (fontSize) + "px Arial";
        x = p.x;
        y = p.y;


        this.height = fontSize + (vPad * 2);
        //this.height = p.position.height;
        this.width = c.measureText(s.label).width + (hPad * 2);
        //this.width = p.position.width;
        var grd = c.createLinearGradient(x, y + 10, x, y + this.height);
        grd.addColorStop(0, "#fff"); // white
        grd.addColorStop(1, "#e0e0e0"); // grey
		
        var up = {
            x: x,
            y: y,
            width: this.width,
            height: this.height,
            fill: grd,
            border: 0.3,
            'border-color': "#777"
        }
		
		 var down = {
            x: x,
            y: y,
            width: this.width,
            height: this.height,
            fill: grd,
            border: 0.8,
            'border-color': "#111"
        }
        
		
        var e = {
            onclick: s.onclick,
            onmouseover: s.onmouseover,
            type: "button",   
			custom : s.custom,        
            up : up,
			down : down,
			label :{
				hPad : hPad,
				vPad : vPad,
				text: s.label,
				'font-size' : fontSize
				}
        }
		cd.push(e);
		jtk.prototype.Rectangle(e.up,e.label,false);

        
        return e;
		
    };

/* 
	Display Label Widget on Canvas
	*/
    jtk.prototype.Label = function (p, s) {
        s = (typeof s == "undefined") ? 'defaultValue' : s
        //console.log(p);
        c.beginPath();
        font = "Arial";

        color = (s.color) ? s.color : "red";
        size = (s.size) ? s.size : 10;
        c.font = size + "pt" + ' ' + font;
        c.fillStyle = color;
        //alert(p.text);
        c.fillText(s.text, p.x, p.y + size);

        return ({
            type: "label",
            text: s.text,
            color: color,
            size: size,
            font: font
        });
    };

    return jtk;
})(jtk);