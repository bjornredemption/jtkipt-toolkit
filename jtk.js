var jtk;
jtk = (function () {
    var c, canvas, width, cd, txt;
	// array to hold child elements for events
	cd = [];
	txt = [];

	// add create:prototype inheritance call for older implementation support ( 1.8.5)
	if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

    function jtk(str) {
        canvas = document.getElementById(str);
        c = canvas.getContext('2d');
        // add listeners to the canvas
		canvas.addEventListener("click", clickEvent, false);
		canvas.addEventListener("click", clickEventTextField, false);
        canvas.addEventListener("mousedown", clickEvent, false);
		canvas.addEventListener("mousemove", mouseOverEvent, false);
        canvas.addEventListener("mouseup", clickEvent, false);
		// add dimension properties for reading when we create the root positioning element
        this.width = canvas.width;
        this.height = canvas.height;
    }

    function clickEvent(e) {
        for (child in cd) {
            // return a rectangular representation of the button and apply ispointinpath on it
            if (jtk.prototype.Rectangle(cd[child].up,null, true).isPointInPath(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)) {
					
                if (e.type == 'mousedown') {
					// apply the down style of the button
                    jtk.prototype.Rectangle(cd[child].down,cd[child].label, false);
                }
                if (e.type == 'mouseup') {	
					// apply the up style of the button				
                    jtk.prototype.Rectangle(cd[child].up,cd[child].label, false);
					// do onclick if specified
                    cd[child].onclick();
					// apply the up action
					jtk.prototype.Rectangle(cd[child].up,cd[child].label, false);
                }

            }
        }
    }
	
	 function clickEventTextField(e) {
        for (child in txt) {
            // return a rectangular representation of the button and apply ispointinpath on it
            if (jtk.prototype.Event.isHit(txt[child].hittest).isPointInPath(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)) {
				txt[child].onclick();
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
            return jtk.prototype.Positioning.box.create(p,'hbox');
            break;
        case "vbox":
            return jtk.prototype.Positioning.box.create(p,'vbox');
            break;
        case "label":
            p.parent.children[p.index] = this.Label(p.parent.pos[p.index], s);
            break;
		case "textfield":
            this.Textfield(p.parent.pos[p.index], s);
            break;
        case "button":
            this.Button(p.parent.pos[p.index], s);
            break;
        }
    }
	
	//positioning : move this into the main jtk object later
    jtk.prototype.Positioning = {
        // object tree that hold all jtk widgets
		jom: [],
		// box
        box: {
			// function that creates positioning element
			// b : params passed from jtk.create
			// type : hbox or vbox
            create: function (b,type) {
				
                numChildren = b.children;
				// set to the parent reference
                p = b.parent;
				// the index of the box on which this element will be attached to
                index = b.index;
				
				// the root positioning elements is the canvas and so we treat it different
                if (p.num == undefined) {
                    maxWidth = p.width;
                    maxHeight = p.height;
                    startX = 0;
                    startY = 0;
				// jtk positioning element
                } else {
                    maxWidth = p.pos[index].width;
                    maxHeight = p.pos[index].height;
                    startX = p.pos[index].x;
                    startY = p.pos[index].y;
                }
				
				// calculate width of the child elements of the new positioning element we are creating
				if (type==='hbox'){
					width = Math.floor(maxWidth / numChildren);	
					height = maxHeight;
					}
				if (type==='vbox'){
					width = maxWidth;	
					height = Math.floor(maxHeight / numChildren);
					}
                
				// object we will be using to represent this in the jom
               var e = {
                    type: type,
                    num: numChildren,
					// this will contain widegts and possibly child positioning elements
                    children: [],
					// this will contain the dimensions of the children for this element
                    pos: [],
                  }
				
				// create dimension for the children of the new positioning element
                for (i = 0; i < numChildren; i++) {
					if (type==='hbox'){
						obj = (i == 0) ? { x: startX,y:startY } : { x: e.pos[e.pos.length - 1].x + width, y:startY };
						}
					if (type==='vbox'){
	                    obj = (i == 0) ? { x: startX,y:startY } : { y: e.pos[e.pos.length - 1].y + height, x:startX };
					}
					obj.width = width;
                    obj.height = height;
                    e.pos.push(obj);
                    e.children.push({});
                }
				// if this is the root node attach it to the jom tree at the top
                if (p.num == undefined) {
                    jtk.prototype.Positioning.jom.push(e);
				// if not attach this to the current node  of the jom
                } else {
                    p.children[index] = e;
                }
                // console.log(jtk.prototype.Positioning.a);
                return e;

            },
            // move this up to parent
            getChild: getChild,
            add: addChild
        }
    };
	
	jtk.prototype.Textfield = function(p,s){
		var p = {
			width:p.width,
			height:p.height,
			x:p.x,
			y:p.y
		}
		// object we will be using to represent this in the jom
        var e = {
			vPad : 8,
			hPad : 5,
			fontSize : 10,
			position:p,	
			hittest : {
				width:p.width,
				height: p.height,
				x:p.x,
				y:p.y
				},
			value : [],
			onkeypress : function(evt){					
					keyChar = String.fromCharCode(evt.which);
					//alphaNumCheck = /\w/; // Will only accept a-z, A-Z, 0-9 & _
					//character = keyChar.match(alphaNumCheck);
					e.value = e.value +""+ keyChar;					
					e.redraw();
				},
			click : s.onclick,	
            onclick: function(){
				removelisteners()
				window.addEventListener("keypress", e.onkeypress, false);
				e.click();
				},
			redraw : function(){
				c.font = e.fontSize +" Arial";
				c.clearRect(e.position.x - 1, e.position.y -1, e.position.width + 2, e.fontSize + (2*e.vPad) +2);
				c.beginPath();
				var grd = c.createLinearGradient(e.position.x, e.position.y , e.position.x, e.position.y + e.fontSize );
        		grd.addColorStop(1, "#fff"); // white
        		grd.addColorStop(0, "#f0f0f0"); // grey
				c.lineWidth = 0.3;
				c.strokeStyle = "#333333";				
				c.rect(e.position.x, e.position.y , e.position.width, e.fontSize + (2*e.vPad));
				c.fillStyle = grd;
				c.fill();
				c.fillStyle = "#333333";
				c.stroke();
				c.closePath();
				c.fillText(e.value, e.position.x + 5 , e.position.y + 15);
				},	
           	type: "textfield" 
        }
		txt.push(Object.create(e));
		// draw it
		e.redraw();     
        return e;
		}
		
	function removelisteners(){
		 for (child in txt) {
    		//console.log(txt[child].onkeypress);
	        window.removeEventListener("keypress", txt[child].onkeypress,false);
        }
		}
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
	
	// simple rectangle	
    jtk.prototype.Event =  {
		isHit : function(hittest){
			 c.beginPath();
			  c.lineWidth =0;
           	 c.rect(hittest.x, hittest.y, hittest.width, hittest.height);
			 return c;
			}
    };

    // simple button	
    jtk.prototype.Button = function (p, s) {
        var width, height;
		// default font size
        var fontSize = 12;
		// vertical and horizontal padding between text and top / bottom / left edge of button
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
		
		// define up state
        var up = {
            x: x,
            y: y,
            width: this.width,
            height: this.height,
            fill: grd,
            border: 0.3,
            'border-color': "#777"
        }
		// define down state
		 var down = {
            x: x,
            y: y,
            width: this.width,
            height: this.height,
            fill: grd,
            border: 0.8,
            'border-color': "#111"
        }
        
		// object we will be using to represent this in the jom
        var e = {
			// onclick function
            onclick: s.onclick,
            onmouseover: s.onmouseover,
            type: "button",   
			// custom params that can be set are attached to the button
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
		// draw it
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