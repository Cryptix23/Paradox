// Models are where actual data is kept. They can also be used
// for communicating between the server and the client through
// methods like save() and fetch().
//
// Models are the abstract data and do not know how they are
// supposed to be visualized. But they can perform validations
// to ensure the data is correct.

 
// Our base model is "post"
Known_P = Backbone.Model.extend({
	// Default attributes for the Known_P item.
		defaults: function() {
			return {
				cid:"",
				nick: "empty line...",
				desc: "empty line...",
				destination: "empty line...",
				banned: 0,
				ifollow: 0,
				followme: 0,
				state:0,
				title:""
				
			};
		}
});
 
// KnownsCollection_P collection
KnownsCollection_P = Backbone.Collection.extend({
	model: Known_P,
	initialize: function() {
        //this.on('change', function() { this.sort() }, this);
		//this.on('change', this.render);
    }
});

var Knowns_P = new KnownsCollection_P;

// Views are responsible for rendering stuff on the screen (well,
// into the DOM).
//
// Typically views are instantiated for a model or a collection,
// and they watch for change events in those in order to automatically
// update the data shown on the screen.

 
KnownView_P = Backbone.View.extend({
	//... is a list tag.
	tagName:  "li",
	// Cache the template function for a single item.
	template: _.template($('#Known_P-template').html()),
	events: {
		"click .block"   	: "block",
		"click .unblock"    : "unblock",
		"click .read"   	: "readPosts",
		"click .follow"   	: "follow",
		"click .unfollow"   : "unfollow",
		"click .chat"   	: "startchat",
		
		"click .state0"   	: "connect",
		"click .state1"   	: "disconnect",
		"click .state2"   	: "disconnect"
	},
		
	/*initialize: function(options) {
		// Ensure our methods keep the `this` reference to the view itself
		_.bindAll(this, 'render');
		// If the model changes we need to re-render
		this.model.bind('change', this.render);
	},*/
	initialize: function(options) {
		if(this.model)
		{
			this.model.set("cid",this.model.cid);
			this.model.on('change:nick', this.renderNick, this);
			//this.model.on('change:destination', this.renderDest, this);
			this.model.on('change:desc', this.renderDesc, this);
			this.model.on('change:state', this.renderState, this);
			this.model.on('change:banned', this.renderBanned, this);
			this.model.on('change:ifollow', this.renderIfollow, this);
			this.model.on('change:followme', this.renderFollowme, this);
			//this.model.on('change:title', this.renderTitle, this);
		};
    },

    renderNick: function() {console.log("renderNick");
        $(".nick_P", this.$el).html(_.escape(this.model.get("nick")));
		//$(this.$el).foundation();
		return this;
    },
	renderDesc: function() {console.log("renderDesc");
        $("span:first", this.$el).attr("title",_.escape(this.model.get("desc")));
		//$(this.$el).foundation();
        return this;
    },
	renderBanned: function() {console.log("renderBanned");
        var i=parseInt(this.model.get("ifollow"));
		var me=parseInt(this.model.get("followme"));
		var b=parseInt(this.model.get("banned"));
		var c="i"+i+" "+"me"+me+" "+"b"+b+"  secondary button split";
        $("span:first", this.$el).attr("class",c);
		$("li > a.b0, li > a.b1", this.$el).css("display","none");
		$("li > a.b"+b, this.$el).css("display","block");
		//$(this.$el).foundation();
		return this;
    },
	renderIfollow: function() {console.log("renderIfollow");
        var i=parseInt(this.model.get("ifollow"));
		var me=parseInt(this.model.get("followme"));
		var b=parseInt(this.model.get("banned"));
		var c="i"+i+" "+"me"+me+" "+"b"+b+"  secondary button split";
        $("span:first", this.$el).attr("class",c);
		$("li > a.f0, li > a.f1", this.$el).css("display","none");
		$("li a.f"+i, this.$el).css("display","block");
		//$(this.$el).foundation();
		return this;
    },
	renderFollowme: function() {console.log("renderFollowme");
		var i=parseInt(this.model.get("ifollow"));
		var me=parseInt(this.model.get("followme"));
		var b=parseInt(this.model.get("b"));
		var c="i"+i+" "+"me"+me+" "+"b"+b+"  secondary button split";
        $("span:first", this.$el).attr("class",c);
		$("li a.c", this.$el).css("display",(me==1)?"block":"none");
		//this.$el.foundation();
		return this;
    },
	
    renderState: function() {
		console.log("renderState");
        $("span > div", this.$el).attr("class","state"+this.model.get("state"));
		switch(this.model.get("state"))
		{
			case "0":$("span > div", this.$el).attr("title","__("Isoff")");break;
			case "1":$("span > div", this.$el).attr("title","__("Connecting")");break;
			case "2":$("span > div", this.$el).attr("title","__("Connected")");break;
		}
		//$("span > div", this.$el).attr("title",this.model.get("title"));
		//$(this.$el).foundation();
        return this;
    },

    render: function() {
        this
            .renderNick()
            .renderDest()
            /*.renderState()*/
            .renderDesc()
            .renderBanned()
            .renderIfollow()
            .renderFollowme();
    },
	
	
	newitemrender: function() {
		if(this.model)
		{
			console.log("new item rendering");
			switch(this.model.attributes.state)
			{
				case 0:this.model.attributes.title="__("Isoff")";break;
				case 1:this.model.attributes.title="__("Connecting")";break;
				case 2:this.model.attributes.title="__("Connected")";break;
			}
			this.$el.html(this.template(this.model.toJSON()));
			$("span > span",this.$el).click();
			return this;
		};
	},
	block: function(){
		sendCmd("th","ban",{id:this.model.attributes._id, destination:this.model.attributes.destination});
		//sendCmd("th","disconnect",{destination:this.model.attributes.destination});
		//this.model.destroy();
		return this;
	},
	unblock: function(){
		console.log(this.model);
		sendCmd("th","unban",{id:this.model.attributes._id});
		return this;
	},
	readPosts: function(){
		//this.model.attributes.state=1;
		renderPeersLists_P();
		sendCmd("th","readlast",{destination:this.model.attributes.destination});
		return this;
	},
	follow: function(){
		sendCmd("th","follow",{id:this.model.attributes._id, destination:this.model.attributes.destination});
		return this;
	},
	unfollow: function(){
		sendCmd("th","unfollow",{id:this.model.attributes._id, destination:this.model.attributes.destination});
		return this;
	},
	connect: function(){
		sendCmd("th","connect",{destination:this.model.attributes.destination});
		return this;
	},
	disconnect: function(){
		sendCmd("th","disconnect",{destination:this.model.attributes.destination});
		return this;
	},
	startchat: function(){
		ChatPeers_P.add(this.model.toJSON());
		sendCmd("th","startchat",{ destination:this.model.attributes.destination});
		$(".chatscnt_P").html(ChatPeers_P.models.length);
		if($("#ChatsTab_P").css("display")!="block")$(".chatscnt_P").toggleClass("bold");
		$('a[href="#ChatsTab_P"]').click();
		return this;
	}
});

 
KnownsCollectionView_P = Backbone.View.extend({
	// The collection will be kept here
	collection: null,
	 
	// The Knowns_P list view is attached to the table body
	el: $("#Known_P-list"),/*$("#Knownapp"),*/
	
	initialize: function(options) {
		///////////////////////////////////////////////
		this.collection = new KnownsCollection_P();
		this.collection = options.collection;
		//
        //////////////////this.collection.on('all', function() { this.render() }, this);
		//this.collection.on('add', function() { this.render() }, this);
		///////////////////////////////////////////////
		// Ensure our methods keep the `this` reference to the view itself
		_.bindAll(this, 'render');
		// Bind collection changes to re-rendering
		//////////////////////this.collection.bind('change', this.render);
		this.collection.bind('reset', this.render);
		this.collection.bind('add', this.render);
		this.collection.bind('remove', this.render);
	},
	 
	render: function(item) {
		var element = jQuery(this.el);
		//this.el2=jQuery("#IFollow-list");
		// Clear potential old entries first
		element.empty();
		// Go through the collection items
		this.collection.forEach(function(item) {
			var itemView = new KnownView_P({
					model: item
				});
				// Render the KnownsCollectionView_P, and append its element
				// to the table
				element.append(itemView.newitemrender().el);
		});
		/*this.collection.forEach(function(item) {
			console.log("this.collection.forEach(function(item) {");
			if(element.children().length>0){
				element.children().each(function(i) {
					console.log(element.children());
					if(element.children()[i].children() && element.children()[i].children()[0].attr("data-destination")!=item.attributes.destination)
					{
						console.log(item);
					};
				});
				
			}
			else
			{
				// Instantiate a KnownsCollectionItem view for each
				//console.log("known");
				//console.log(item);
				var itemView = new KnownView_P({
					model: item
				});
				// Render the KnownsCollectionView_P, and append its element
				// to the table
				element.append(itemView.newitemrender().el);
			};	
		});
		*/
		/*var itemView = new KnownView_P({
					model: item
				});
				// Render the KnownsCollectionView_P, and append its element
				// to the table
		if(typeof(itemView.newitemrender())!="undefined")element.append(itemView.newitemrender().el);*/
		
		return this;
	}
});


var KnownsList_P = new KnownsCollectionView_P({
	collection: Knowns_P
});
function renderPeersLists_P()
{
	KnownsList_P.render();
};
renderPeersLists_P();