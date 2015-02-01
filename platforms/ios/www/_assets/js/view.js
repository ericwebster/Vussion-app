

  /*
  Todo's:
    -  when changing sections, presentations are reset. dont know if thats good.
    -  if a user joins after the presentation starts, client does not update until the next emit
    -  there are multiple "slide changes" on each emit, gotta figure that out
  */

  function merge(target, source) {
    /* Merges two (or more) objects,
     giving the last one precedence */
    if ( typeof target !== 'object' ) {
      target = {};
    }
    for (var property in source) {
      if ( source.hasOwnProperty(property) ) {
          var sourceProperty = source[ property ];
          if ( typeof sourceProperty === 'object' ) {
              target[ property ] = util.merge( target[ property ], sourceProperty );
              continue;
          }
          target[ property ] = sourceProperty;
      }
    }
    for (var a = 2, l = arguments.length; a < l; a++) {
      merge(target, arguments[a]);
    }
    return target;
  }

  //remote-presetaton
  var Vussion = {
    settings: {
      debug: true,
      pathToAssets: '',
      server: 'http://192.168.1.50',
      port:'3000'
    },
    state:{
      current:{
        section: 0,
        slide: 0
      }
    },
    init: function(settings){
      Vussion.debugLog('init');
      merge(Vussion.settings, settings);

      Vussion.data = ExternalData;
      if(window.localStorage.getItem('settings')){
        Vussion.debugLog("found local settings");
        Vussion.getSettingsFromLocalStorage();
        Vussion.debugLog("connect to >> " + Vussion.settings.server + ":" + Vussion.settings.port);
      } else {
        Vussion.debugLog("no local settings");
      }

      Vussion.socket = io(Vussion.settings.server + ":" + Vussion.settings.port);
      Vussion.registerHandlebarHelpers();
      Vussion.bindEvents();
    },
    bindEvents: function(){
      Vussion.socket.on('connect', function(){

        Vussion.debugLog("socket.on >> connected captain");

        //have the client machine request the current state of the presentation
        Vussion.debugLog("socket.on >> requested state");
        Vussion.socket.emit("request state");

        //this should trigger a current state emit from the server
        Vussion.socket.on('current state', function(state){
          Vussion.debugLog("socket.on >> loading current state");
          Vussion.state.current = state;
          Vussion.changeSection(state.section); 
        })

        //this is the main section change update, possibly rename todo:
        Vussion.socket.on('update', function(res){
          Vussion.debugLog("socket.on >> update")

          if(res.section.id != Vussion.state.current.section.id){
            //section has changed
            Vussion.debugLog("socket.on >> section change");
            Vussion.state.current.section = res.section;
            Vussion.changeSection(res.section); 
          }

        });

        Vussion.socket.on('change video', function(state){
          console.log(state.video);
          if(state.section.id != Vussion.state.current.section.id){
            Vussion.debugLog("emergency section change");
            Vussion.state.current.section = state.section;
            Vussion.changeSection(state.section); 
          }
          if(state.video != Vussion.state.current.video){
            Vussion.debugLog("video change");
            Vussion.state.current.video = state.video;
            Vussion.playVideo();
          }
        }); 
      })
      Vussion.socket.on('error', function(err){
        Vussion.debugLog("socket.on >> Oh-oh error on io.connect");
        Vussion.debugLog("Settings >>");
        Vussion.debugLog(Vussion.settings);
        Vussion.debugLog("Err OBJ >>");
        Vussion.debugLog(err);
      })
      $("#settings-form").submit(function(){
        Vussion.debugLog("bind form");
        Vussion.settings.server = $("#serverAddress").val();
        Vussion.settings.port = $("#serverPort").val();
        Vussion.writeSettingsToLocalStorage();
        return false;
      })
      
    },
    playVideo: function(){
      Vussion.debugLog("change video file & play");
      Vussion.vidplayer.src(Vussion.state.current.video).play();
    },
    getCurrentState: function(){
      Vussion.debugLog("getting current state");
      Vussion.socket.emit('request state');
    },
    changeSlide: function(num){
      Vussion.debugLog("change slide");
      Vussion.presentation.slickGoTo(num);
    },
    writeSettingsToLocalStorage: function(){
      Vussion.debugLog("write to local storage");
      window.localStorage.setItem('settings', JSON.stringify(Vussion.settings));
      window.reload();
    },
    getSettingsFromLocalStorage: function(){
      Vussion.debugLog("read from local storage");
      merge(Vussion.settings, $.parseJSON( window.localStorage.getItem('settings') ) );
    },
    debugLog: function(message){
      console.log(message);
      $('#debugger ul').append($('<li>').text(message));
    },
    compileTemplate: function(templateID, data){
      var source   = $(templateID).html();
      var template = Handlebars.compile(source);
      var markup = template(data);
      return markup;
    },
    registerHandlebarHelpers: function(){

      Handlebars.registerHelper('assetPath', function(options) {
        console.log(Vussion.settings)

        var html = Vussion.settings.pathToAssets + options.fn(this);
        return html;
      });

    },
    changeSection: function(section){
      //requires Vussion.state.current.section to be updated
      $("section").removeClass("active");

      switch (section.type) {
        case "slider":
          // when an admin changes the section === "slider"
          var sectionEl = $("section#" + section.type);
          $(sectionEl).html(Vussion.compileTemplate("#slide-template", section)).promise().done(function(){
            $("#slick-slider").slick();
            $("section#" + section.type).addClass("active");
          })
          break;

        case "html":
          // when an admin changes the section === "html"
          var sectionEl = $("section#" + section.type);
          var html = Vussion.compileTemplate("#"+ section.template, section);
          $(sectionEl).html(html).promise().done(function(){
            $("section#" + section.type).addClass("active");
          })
          break;

        case "video":
          var sectionEl = $("section#" + section.type);
          var html = Vussion.compileTemplate("#video-template", section);
          $(sectionEl).html(html).promise().done(function(){
            $("section#" + section.type).addClass("active");
            Vussion.vidplayer = videojs("#player" + section.id, {
              "controls": true,
              "poster": "http://www.placehold.it/1280x720.jpg"
            });
            console.log(Vussion.vidplayer);
          })
          break;

        case "loading":
          $("section#" + section.type).addClass("active");
          break;

        default:
          Vussion.debugLog("hmmm I dont know what to do with this one.");
          break;
      }
    }
  };  