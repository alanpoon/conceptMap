function conceptMap(id, data, options) { 
     d3.selection.prototype.size = function() {
    var n = 0;
    this.each(function() { ++n; });
    return n;
  };
	var w = 1200,
    c = 800,
    h = c,
    rectWidth = 200,
    rectHeight = 22,
    S = 20,
    s = 8,
    R = 110,
    J = 30,
    o = 15,
    t = 20,
	 centerCircleRadius = 100,
        episodeName = options.episodeName,
        themeName = options.themeName,
        perspectiveName = options.perspectiveName,
		entityName=options.entityName,
    duration = 1000,
    ease = 'elastic',
    highlightColor = '#0da4d3',
	themeColor = "#666",
	  showConnector = true; // connector between perspectives
	  if('undefined' !== typeof options){
			if('undefined' !== typeof options.width) w = options.width;
			if('undefined' !== typeof options.height) {
				c = options.height;
				h = c;
			}
			if('undefined' !== typeof options.rectWidth) rectWidth = options.rectWidth;
			if('undefined' !== typeof options.rectHeight) rectHeight = options.rectHeight;
			if('undefined' !== typeof options.centerCircleRadius) centerCircleRadius = options.centerCircleRadius;
			
			if('undefined' !== typeof options.themeName) themeName = options.themeName;
			if('undefined' !== typeof options.episodeName) episodeName = options.episodeName;
			if('undefined' !== typeof options.perspectiveName) perspectiveName = options.perspectiveName;
			
			if('undefined' !== typeof options.duration) duration = options.duration;
			if('undefined' !== typeof options.ease) ease = options.ease;
			if('undefined' !== typeof options.themeColor) themeColor = options.themeColor;
			if('undefined' !== typeof options.showConnector) showConnector = options.showConnector;
		}
    var T,q, x,j,H,A,P;
    var L = {},k = {};
    var i,y;
    var r = d3.layout.tree() .size([360,
    h / 2 - R]) .separation(function (Y, X) {
        return (Y.parent == X.parent ? 1 : 2) / Y.depth
    });
    var projection = d3.svg.diagonal.radial() .projection(function (X) {
        return [X.y,
        (X.x) / 180 * Math.PI]
    });
    var v = d3.svg.line() .x(function (X) {
        return X[0]
    }) .y(function (X) {
        return X[1]
    }) .interpolate('bundle') .tension(0.1);
    var d = d3.select(id) .append('svg') .attr('width', w) .attr('height', c) .append("g") .attr('transform', 'translate(' + w / 2 + ',' + c / 2 + ')');
    var I = d.append('rect') .attr('class', 'bg') .attr({
        x: w / - 2,
        y: c / - 2,
        width: w,
        height: c,
        fill: 'transparent'
    }) .on('click', showMap);
    var B = d.append("g") .attr('class', 'links'),
    f = d.append("g") .attr('class', 'episodes'),
    E = d.append("g") .attr('class', 'nodes');
	
    var info = d3.select('#graph-info');
    //d3.json('/wp-content/themes/conversation_theme/metadata.php', function (X, Y) {
	var scale = d3.scale.linear()
                    .domain([options.minCount, options.maxCount])
                    .range([7, 25]);
		Y=data;
        T = d3.map(Y);
		
        q = d3.merge(T.values());
        x = {};
        A = d3.map();

        q.forEach(function (aa) {
            aa.key = p(aa.name);
            aa.canonicalKey = aa.key;
            x[aa.key] = aa;
		    if (aa.group) {
			//#
                if (!A.has(aa.group)) {
				A.set(aa.group, [])
				
                }
				//# A gets some value
                A.get(aa.group).push(aa)
				
            }
        });
        j = d3.map();
        T.get('episodes') .forEach(function (aa) {
            aa.links = aa.links.filter(function (ab) {
                return typeof x[p(ab)] !== 'undefined' && ab.indexOf('r-') !== 0
            });
            j.set(aa.key, aa.links.map(function (ab) {
                var ac = p(ab);
                if (typeof j.get(ac) === 'undefined') {
                    j.set(ac, [
                    ])
                }
                j.get(ac) .push(aa);
                return x[ac]
            }))
        });
		
        var Z = window.location.hash.substring(1);
		console.log("Zhash",Z);
        if (Z && x[Z]) {
			    showDetails(x[Z])
			
        } else {
            showMap();
            drawMap();
        }
	
		/*
        window.onhashchange = function () {
            var aa = window.location.hash.substring(1);
            if (aa && x[aa]) {
			//console.log("on hash change nodes && x[nodes]",x[aa]);
           //     showDetails(x[aa], true)
            }
        }
		*/
	 var tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("font", "Arial black;")
			.style("font-size", "11px")
			.style("margin", "8px")
			.style("padding", "5px")
			.style("border", "1px solid #000")
			.style("background-color", "rgba(255,255,255,1)")
			.style("position", "absolute")
			.style("fillColor-index", "1001")
			.style("opacity", "0.8")
			.style("border-radius", "3px")
			.style("box-shadow", "5px 5px 5px #888")
			.style("visibility", "hidden");
    	
	//build DirectoryType	
	if(typeof view!=="undefined")
    var directoryType={"episode":view.typeinfo.data.transitStnCol,"perspective":view.typeinfo.data.finStnCol,"theme":view.typeinfo.data.finStnCol};
	// helper functions
    function showMap() {
        if (L.node === null) {
            return
        }
        L = {
            node: null,
            map: {}
        };
        i = Math.floor(c / T.get('episodes') .length);
        y = Math.floor(T.get('episodes') .length * i / 2);
        T.get('episodes') .forEach(function (af, ae) {
            af.x = rectWidth / - 2;
            af.y = ae * i - y;
        });
        var ad = 180 + J,
        nodes = 360 - J,
        ac = (nodes - ad) / (T.get('themes') .length - 1);
        T.get('themes') .forEach(function (af, ae) {
            af.x = nodes - ae * ac;
            af.y = h*(1.25) / 2 - R;
            af.xOffset = - S+w/12;
            af.depth = 1;
        });
        ad = J;
        nodes = 180 - J;
        ac = (nodes - ad) / (T.get('perspectives') .length - 1);
        T.get('perspectives') .forEach(function (af, ae) {
            af.x = ae * ac + ad;
            af.y = h*(1.25) / 2 - R;
            af.xOffset = S-w/12;
            af.depth = 1
        });
        H = [];
        var ab,Y,aa,X = h*(1.25) / 2 - R;
        T.get('episodes') .forEach(function (ae) {
            ae.links.forEach(function (af) {
                ab = x[p(af)];
				
                if (!ab || ab.type === 'reference') {
                    return
                }
                Y = (ab.x - 90) * (Math.PI) / 180;
                aa = ae.key + '-to-' + ab.key;
                H.push({
                    source: ae,
                    target: ab,
                    key: aa,
                    canonicalKey: aa,
                    x1: ae.x + (ab.type === 'theme' ? 0 : rectWidth),
                    y1: ae.y + rectHeight / 2,
                    x2: Math.cos(Y) * X + ab.xOffset,
                    y2: Math.sin(Y) * X
                })
            })
        });
        P = [];
        A.forEach(function (af, ag) {
            var ae = (ag[0].x - 90) * Math.PI / 180;
            a2 = (ag[1].x - 90) * Math.PI / 180, bulge = 20;
            P.push({
                x1: Math.cos(ae) * X + ag[0].xOffset,
                y1: Math.sin(ae) * X,
                xx: Math.cos((ae + a2) / 2) * (X + bulge) + ag[0].xOffset,
                yy: Math.sin((ae + a2) / 2) * (X + bulge),
                x2: Math.cos(a2) * X + ag[1].xOffset,
                y2: Math.sin(a2) * X
            })
        });
        window.location.hash = '';
	//notifySelect on the front page
	
	var selData=_.pluck(T.get('episodes'),'name');
	var selData=_.map(selData,function(name) { return name.split(" ")[0];});
	console.log('selData',selData);
		/*	window.elx.dashboard.view.notifySelect(view.id,{
	            type: "value",
	            col: selCol,
	            sels: selData
	        });
			
			*/
        drawMap();
    }
    function showDetails(Y, X) {
        if (L.node === Y && X !== true) {
                   L.node.children.forEach(function (aa) {
                aa.children = aa._group
            });
		
            drawDetails();
            return
        }
        if (Y.isGroup) {
            L.node.children.forEach(function (aa) {
                aa.children = aa._group
            });
            Y.parent.children = Y.parent._children;
			
            drawDetails();
            return
        }
        Y = x[Y.canonicalKey];
        q.forEach(function (aa) {
            aa.parent = null;
            aa.children = [];
            aa._children = [];
            aa._group = [];
            aa.canonicalKey = aa.key;
            aa.xOffset = 0
        });
        L.node = Y;
        L.node.children = j.get(Y.canonicalKey);
        L.map = {};
          var Z = 0;
        L.node.children.forEach(function (ac) {
            L.map[ac.key] = true;
            ac._children = j.get(ac.key).filter(function (ad) {
                return ad.canonicalKey !== Y.canonicalKey
            });
            ac._children = JSON.parse(JSON.stringify(ac._children));
            ac._children.forEach(function (ad) {
                ad.canonicalKey = ad.key;
                ad.key = ac.key + '-' + ad.key;
                L.map[ad.key] = true
            });
            var aa = ac.key + '-group',
            ab = ac._children.length;
			
			 // var total = (Math.random() * 20 + 10).toFixed(0);            
            var total = 0;
        /*@    ac.cardTypes.forEach(function(card) {
            	total += card.count;
        	});
			*/
		    ac._group = [
                {
                    isGroup: true,
                    key: aa + '-group-key',
                    canonicalKey: aa,
                    name: ab,
                    count: ab,
                    xOffset: 0,
					txnTotal: total
                }
            ];
            L.map[aa] = true;
            Z += ab
        });
        L.node.children.forEach(function (aa) {
            //aa.children = nodes > 50 ? aa._group : aa._children
			aa.children = Z > options.zLimit ? aa._group : aa._children

        });
        window.location.hash = L.node.key;

        drawDetails();
		
    }
    function mouseoutNode() {
        k = {
            node: null,
            map: {}
        };
        fillColor();
		 if (tooltip) tooltip.style("visibility", "hidden");
    }
    function mouseoverNode(X) {
        if (k.node === X) {
            return
        }
        k.node = X;
        k.map = {
        };
        k.map[X.key] = true;
        if (X.key !== X.canonicalKey) {
            k.map[X.parent.canonicalKey] = true;
            k.map[X.parent.canonicalKey + '-to-' + X.canonicalKey] = true;
            k.map[X.canonicalKey + '-to-' + X.parent.canonicalKey] = true
        } else {
            j.get(X.canonicalKey) .forEach(function (Y) {
                k.map[Y.canonicalKey] = true;
                k.map[X.canonicalKey + '-' + Y.canonicalKey] = true
            });
            H.forEach(function (Y) {
                if (k.map[Y.source.canonicalKey] && k.map[Y.target.canonicalKey]) {
                    k.map[Y.canonicalKey] = true
                }
            })
        }
        fillColor();
		        if (X.txnCount) {
    		tooltip.style("visibility", "visible")
				.style("top", (d3.event.pageY-35)+"px")
				.style("left", d3.event.pageX+"px")
				.html("Transaction Count: " + X.txnCount);
        }
        if (X.txnTotal) {
    		tooltip.style("visibility", "visible")
				.style("top", (d3.event.pageY-35)+"px")
				.style("left", d3.event.pageX+"px")
				.html("Transaction Total: " + X.txnTotal);
        }
    }
    function drawMap() {
	var map=true;
	this.map=map;
        drawLinks();
        B.selectAll('path') .attr('d', function (X) {
            return v([
			[X.x1,X.y1],
            [X.x1,X.y1],
            [X.x1,X.y1]
			])
        }) .transition() .duration(duration) .ease(ease) .attr('d', function (X) {
            return v([
			[X.x1,X.y1],
            [X.target.xOffset * s,0],
            [X.x2,X.y2]
			])
        });
        drawRect(T.get('episodes'));
		X=d3.merge([T.get('themes'),
        T.get('perspectives')]);
		
		
       drawCircle(X);
        drawAnchorLink([]);
        //@ if (showConnector) drawConnector(P);
		drawConnector(P);
        info.html('<a href="#">What\'s this?</a>');
        mouseoutNode();
        fillColor();
    }
    function drawDetails() {
	
        var X = r.nodes(L.node);
		this.depthZero;
        X.forEach(function (nodes) {
		if(nodes.depth === 0) { this.depthZero=nodes.name;
		}
	      if (nodes.depth === 1) {
		 
                nodes.y -= 20
            }
		
        });
		
        H = r.links(X);
        H.forEach(function (nodes) {
            if (nodes.source.type === 'episode') {
                nodes.key = nodes.source.canonicalKey + '-to-' + nodes.target.canonicalKey
            } else {
                nodes.key = nodes.target.canonicalKey + '-to-' + nodes.source.canonicalKey
            }
            nodes.canonicalKey = nodes.key
        });
        drawLinks();
        B.selectAll('path') .transition() .duration(duration) .ease(ease) .attr('d', projection);
        drawRect([]);
		drawCircle(X);
        drawAnchorLink([L.node]);
        //@ if (showConnector) drawConnector([]);
		drawConnector([]);
        var Y = '';
        if (L.node.description) {
            Y = L.node.description
        }
        info.html(Y);
        mouseoutNode();
        fillColor();
		
    }
    function drawCircle(data) {
	var mapBool;
	console.log("this.map",typeof this.map);
if (typeof this.map =="boolean") mapBool=this.map;
console.log("mapBool",mapBool);  
	var depthZero=this.depthZero;
	var depthOne=this.depthOne;
	var blank=[];
	_.each(data,function(d){ blank.push(key(d));});
	
		//E.selectAll(".node").size();
		    var X = E.selectAll('.node') .data(data, key);
			var countSelection=E.selectAll('.node').size();
			var countX=X.size();
		//console.log("QWE data",JSON.stringify(blank), "length :",blank.length,"countSelection :",countSelection, " countX:",countX);
		var missing=X.attr("id",function(nodes){ //missing nodes is to get the nodes that were missing from Y
		
	  count=count+1;
	 	  switch (nodes.depth){
		  case 0: depth="nodeDepthZero"; console.log("nodess.",nodes);
		  if (typeof view!=='undefined') { 	window.elx.dashboard.view.notifySelect(view.id,{
	            type: "value",
	            col: directoryType[nodes.type],
	            sels: [nodes.name]
	        });}  break;
		  case 1: if (mapBool) depth="nodeDepthOneMain"; else depth="nodeDepthOne"; break;
		  case 2: depth="nodeDepthTwo"; break;
		  }
		//   console.log("node.name:",nodes.name, "nodes.depth",nodes.depth, "return: ",depth,"count:",count);
		return depth;});
		
	

	var count=0;
      var Y = X.enter().append("g").attr("id",function(nodes){
	  count=count+1;
	 	  switch (nodes.depth){
		  case 0: depth="nodeDepthZero";  if (typeof view!=='undefined') { 	window.elx.dashboard.view.notifySelect(view.id,{
	            type: "value",
	            col: directoryType[nodes.type],
	            sels: [nodes.name]
	        });} break;
		  case 1:if (mapBool) depth="nodeDepthOneMain"; else depth="nodeDepthOne"; break;
		  case 2: depth="nodeDepthTwo";  break; 
		  }
		  // console.log("node.name:",nodes.name, "nodes.depth",nodes.depth, "return: ",depth,"count:",count," node:",nodes);
		return depth;})
		.attr('transform', function (aa) {
		 // var Y = DKY.attr('transform', function (aa) {
            var nodes = aa.parent ? aa.parent : {
                xOffset: 0,
                x: 0,
                y: 0
            };
	          return 'translate(' + nodes.xOffset + ',0)rotate(' + (nodes.x - 90) + ')translate(' + nodes.y + ')'
        }) .attr('class', 'node') 
		.on('mouseover', mouseoverNode) 
		.on('mouseout', mouseoutNode) 
		.on('click', showDetails);
        Y.append('circle') .attr('r',0);
        Y.append('text') .attr('stroke', '#fff') .attr('stroke-width', 4) .attr('class', 'label-stroke');
        Y.append('text') .attr('font-size', 0) .attr('class', 'label').selectAll(".label");
		//d3.selectAll(".label").call(wrap,10);
        X.transition() .duration(duration) .ease(ease) .attr('transform', function (nodes) {
            if (nodes === L.node) {
                return null
            }
		    var aa = nodes.isGroup ? nodes.y + (7 + nodes.count)  : nodes.y;
            return 'translate(' + nodes.xOffset + ',0)rotate(' + (nodes.x - 90) + ')translate(' + aa + ')'
        });
        X.selectAll('circle') .transition() .duration(duration) .ease(ease) .attr('r', function (nodes) {
            if (nodes == L.node) {
	
                return centerCircleRadius;
            } else {
                if (nodes.isGroup) {
				 return scale(nodes.count)*3;
                  
                } else {
				if (!nodes.type) { // sub level circles
                			//return nodes.txnCount;
                		return scale(nodes.txnCount)/2;
                	}
					if (!nodes._group) return scale(d3.round(nodes.cardTypes[0].count))/2; //catch main after refresh
					else {
				//	console.log("!else",nodes, " nodes.depth",nodes.depth,"depthZero: ",depthZero, " nodes.cardTypes:",d3.round(nodes.cardTypes[0].countMe[0][depthZero]));
					
				if(nodes.depth===1 &&nodes._group.length>0) {return scale(d3.round(nodes.cardTypes[0].countMe[0][depthZero]));}  //catch navigated inside
				else if (nodes.depth===1 && nodes._group.length===0) {   //catch main after navigating inside
				return scale(d3.round(nodes.cardTypes[0].count))/2;}
					 else {
					
					 return scale(nodes.count)/2;}
					 }
                // return 4.5;
                }
            }
        }).style("fill",function (nodes) { if(nodes.isGroup) return "#00ced1";});
		
        X.selectAll('text') .transition() .duration(duration) .ease(ease) .attr('dy', '.3em') .attr('font-size', function (nodes) {
            if (nodes.depth === 0) {
                return 20
            } else return 15
        }).text(function (nodes) {
						return nodes.name;
        }) .attr('text-anchor', function (nodes) {
            if (nodes === L.node || nodes.isGroup) {
                return 'middle'
            }
            return nodes.x < 180 ? 'start' : 'end'
        }) .attr('transform', function (nodes) {
            if (nodes === L.node) {
                return null
            } else {
                if (nodes.isGroup) {
                    return nodes.x > 180 ? 'rotate(180)' : null
                }
            }
            return nodes.x < 180 ? 'translate(' + t + ')' : 'rotate(180)translate(-' + t + ')'

        });
//UI adds tspan for the value to nodeDepthOne
		var UI=d3.selectAll("#nodeDepthOne");
		UI.append("text").attr('text-anchor', function (nodes) {
				
            if (nodes === L.node || nodes.isGroup) {
                return 'middle'
            }
            return nodes.x < 180 ? 'start' : 'end'
		    }) .attr('transform', function (nodes) {
            if (nodes === L.node) {
                return null
            } else {
                if (nodes.isGroup) {
                    return nodes.x > 180 ? 'rotate(180)' : null
                }
            }
			return nodes.x < 180 ? 'translate(' + t + ')' : 'rotate(180)translate(-' + t + ')'
        }).append("tspan").attr("dy",+20).text(function (nodes) {
				if (!nodes._group && nodes.depth===1) {return entityName+ d3.round(nodes.cardTypes[0].count);}
		else if (nodes._group.length===0 && nodes.depth===1) {return entityName+ d3.round(nodes.cardTypes[0].count);}
		else if (nodes.depth===1 ) {
				return entityName+d3.round(nodes.cardTypes[0].countMe[0][depthZero]);}
		        });
				//--end UI
	//UI2 adds tspan for the value to nodeDepthOne
		var UI2=d3.selectAll("#nodeDepthTwo");
		UI2.append("text").attr('text-anchor', function (nodes) {
	     if (nodes === L.node || nodes.isGroup) {
                return 'middle'
            }
            return nodes.x < 180 ? 'start' : 'end'
		    }) .attr('transform', function (nodes) {
            if (nodes === L.node) {
                return null
            } else {
                if (nodes.isGroup) {
                    return nodes.x > 180 ? 'rotate(180)' : null
                }
            }
			return nodes.x < 180 ? 'translate(' + t + ')' : 'rotate(180)translate(-' + t + ')'
        }).append("tspan").attr("dy",+20).text(function (nodes) {
		if (!nodes.isGroup) {
		var depthOne=(nodes.parent.name);
		return entityName+ d3.round(nodes.cardTypes[0].countMe[0][depthOne]);}
		   });
				//--end UI2			
        X.selectAll('text.label-stroke') .attr('display', function (nodes) {
            return nodes.depth === 1 ? 'block' : 'none'
        });
				
        X.exit() .remove().each(exitlog);
		
    }
	
	function exitlog(d, i)
        {
           // console.log('exit div', d,"count:",i);
        }
		
		  function text(d, i)
        {
            return d.toString() + ' (' + i.toString() + ')';
        }
        
    function drawLinks() {
        var X = B.selectAll('path') .data(H, key);
        X.enter() .append('path') .attr('d', function (nodes) {
            var Y = nodes.source ? {
                x: nodes.source.x,
                y: nodes.source.y
            } : {
                x: 0,
                y: 0
            };
            return projection({
                source: Y,
                target: Y
            })
        }) .attr('class', 'link');
        X.exit() .remove()
    }
    function drawAnchorLink(nodes) {
        var ac = d.selectAll('.detail') .data(nodes, key);
        var Y = ac.enter() .append('g') .attr('class', 'detail');
        var ab = nodes[0];
        if (ab && ab.type === 'episode') {

			Y.append('text') .attr('fill', '#f7f6ee') .attr('text-anchor', 'middle') .attr('y', (o + t) * - 1).text(episodeName);
			Y.append('text') .attr('fill', '#f7f6ee') .attr('text-anchor', 'middle') .attr('y', (o + t) * + 1).text(function(nodes) {
			return d3.round(nodes.cardTypes[0].count,0);			
			});
        } else {
            if (ab && ab.type === 'theme') {
	                Y.append('text') .attr('fill', '#f7f6ee') .attr('text-anchor', 'middle') .attr('y', (o + t) * - 1).text(themeName);
				Y.append('text') .attr('fill', '#f7f6ee') .attr('text-anchor', 'middle') .attr('y', (o + t) * + 1).text(function(nodes) {
			return d3.round(nodes.cardTypes[0].count,0);			
			});
            } else {
                if (ab && ab.type === 'perspective') {
				
				Y.append('text') .attr('fill', '#f7f6ee') .attr('text-anchor', 'middle') .attr('y', (o + t) * - 1).text(perspectiveName);
			Y.append('text') .attr('fill', '#f7f6ee') .attr('text-anchor', 'middle') .attr('y', (o + t) * + 1).text(function(nodes) {
			return d3.round(nodes.cardTypes[0].count,0);			
			});
                }
            }
        }
        ac.exit() .remove();
		
		// draw left bottom corner link label
        var X = d.selectAll('.all-episodes') .data(nodes);
        X.enter().append('text')
		.attr('text-anchor', 'start') 
		.attr('x', w / - 2 + t+20) 
		.attr('y', c / 2 - t) 
		.text('all episodes') 
		.attr('class', 'all-episodes')
		.on('click', showMap);
        X.exit().remove()
    }
    function drawRect(Y) {
        var Y = f.selectAll('.episode') .data(Y, key);
        var X = Y.enter() .append("g")
		.attr('class', 'episode')
		.on('mouseover', mouseoverNode)
		.on('mouseout', mouseoutNode)
		.on('click', showDetails);// when click on rect, show detailed link
		
        X.append('rect') .attr('x', rectWidth / - 2) .attr('y', rectHeight / - 2) .attr('width', rectWidth) .attr('height', rectHeight) .transition() .duration(duration) .ease(ease) .attr('x', function (Z) {
            return Z.x
        }) .attr('y', function (Z) {
            return Z.y
        });
        X.append('text') .attr('x', function (Z) {
            return rectWidth / - 2 + t
        }) .attr('y', function (Z) {
            return rectHeight / - 2 + o
        }) .attr('fill', '#fff') .text(function (Z) {

            return Z.name+"__("+d3.round(Z.cardTypes[0].count)+")";
        }) .transition() .duration(duration) .ease(ease) .attr('x', function (Z) {
            return Z.x + t
        }) .attr('y', function (Z) {
            return Z.y + o
        });
        Y.exit() .selectAll('rect') .transition() .duration(duration) .ease(ease) .attr('x', function (Z) {
            return rectWidth / - 2
        }) .attr('y', function (Z) {
            return rectHeight / - 2
        });
        Y.exit() .selectAll('text') .transition() .duration(duration) .ease(ease) .attr('x', function (Z) {
            return rectWidth / - 2 + t
        }) .attr('y', function (Z) {
            return rectHeight / - 2 + o
        });
        Y.exit() .transition() .duration(duration) .remove()
    }
    function drawConnector(Y) {
        var X = f.selectAll('path') .data(Y);
        X.enter() .append('path') .attr('d', function (Z) {
            return v([
			[Z.x1,Z.y1],
            [Z.x1,Z.y1],
            [Z.x1,Z.y1]
			])
        }) .attr('stroke', '#000') .attr('stroke-width', 1.5) .transition() .duration(duration) .ease(ease) .attr('d', function (Z) {
            return v([
			[Z.x1,Z.y1],
            [Z.xx,Z.yy],
            [Z.x2,Z.y2]
			])
        });
        X.exit() .remove()
    }
    function fillColor() {
        f.selectAll('rect') .attr('fill', function (X) {
            return l(X, '#000', highlightColor, '#000')
        });
        B.selectAll('path') .attr('stroke', function (X) {
            return l(X, '#aaa', highlightColor, '#aaa')
        }) .attr('stroke-width', function (X) {
            return l(X, '1.5px', '2.5px', '1px')
        }) .attr('opacity', function (X) {
            return l(X, 0.4, 0.75, 0.3)
        }) .sort(function (Y, X) {
            if (!k.node) {
                return 0
            }
            var aa = k.map[Y.canonicalKey] ? 1 : 0,
            Z = k.map[X.canonicalKey] ? 1 : 0;
            return aa - Z
        });
        E.selectAll('circle') .attr('fill', function (X) {
            if (X === L.node) {
                return '#000'
            } else {
                if (X.type === 'theme') {
                    return l(X,themeColor, highlightColor, '#000')
                } else {
                    if (X.type === 'perspective') {
                        return '#fff'
                    }
                }
            }
            return l(X, '#000', highlightColor, '#999')
        }) .attr('stroke', function (X) {
            if (X === L.node) {
                return l(X, null, highlightColor, null)
            } else {
                if (X.type === 'theme') {
                    return '#000'
                } else {
                    if (X.type === 'perspective') {
                        return l(X, '#000', highlightColor, '#000')
                    }
                }
            }
            return null
        }) .attr('stroke-width', function (X) {
            if (X === L.node) {
                return l(X, null, 2.5, null)
            } else {
                if (X.type === 'theme' || X.type === 'perspective') {
                    return 1.5
                }
            }
            return null
        });
 		E.selectAll("#nodeDepthZero text").attr("fill","#fff");
		E.selectAll("#nodeDepthOne text").attr("fill","#000");
		E.selectAll("#nodeDepthOneMain text").attr("fill","#000");
		E.selectAll("#nodeDepthTwo text").attr("fill","#000");
		var was=E.selectAll("#nodeDepthOne").size();

    }
    function p(X) {
        return X.toLowerCase() .replace(/[ .,()]/g, "-")
    }
    function key(X) {
	        return X.key
    }
    function l(X, aa, Z, Y) {
        if (k.node === null) {
            return aa
        }
        return k.map[X.key] ? Z : aa
    }
	
}
