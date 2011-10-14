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

                if (p.num === undefined) {
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
