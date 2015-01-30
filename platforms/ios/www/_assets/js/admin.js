

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
  var Vussion ={
    settings: {
      debug: true
    },
    state:{
      current:{
        section: 0,
        slide: 0
      }
    },
    init: function(settings){
      if(this.settings.debug){
        console.log('init');
      }
      merge(Vussion.settings, settings);

      Vussion.socket = io();

      $.ajax({
        dataType: "json",
        url: "/data/script.json",
        success: function(res){
          Vussion.data = res;
        }
      });

      Vussion.bindEvents();
    },
    bindEvents: function(){
      //switcher for section
      $("select[name=currentSection]").change(function(){
        console.log("select change");
        Vussion.state.current.sectionID = $(this).val();

        _.each(Vussion.data.sections, function(el){
          if(el.id === Vussion.state.current.sectionID){
            Vussion.state.current.section = el;
            Vussion.changeSection(el);
            return false;
          }
        });

      });

    },
    sliderChange: function(slide){
        console.log("send slider change to clients");
        Vussion.state.current.slide = slider.currentSlide;
        Vussion.socket.emit('change slide', Vussion.state.current);
    },
    videoChange: function(video){
        console.log("send video update to clients");
        Vussion.socket.emit('change video', Vussion.state.current);
    },
    updateClients: function(){
      console.log("send update to clients");
      Vussion.socket.emit('update', Vussion.state.current);
    },
    compileTemplate: function(templateID, data){
      var source   = $(templateID).html();
      var template = Handlebars.compile(source);
      var markup = template(data);
      return markup;
    },
    changeSection: function(section){
      console.log("change section:" + section.id)
      //requires Vussion.state.current.section to be updated
      $("section").removeClass("active");

      switch (section.type) {
        case "slider":
          // when an admin changes the section === "slider"
          var sectionEl = $("section#" + section.type);

          var html = Vussion.compileTemplate("#slide-template", section);
          $(sectionEl).html(html).promise().done(function(){
            $("#slick-slider").slick();
            $("section#" + section.type).addClass("active");
          })  

          
          Vussion.updateClients();
          break;

        case "html":
          // when an admin changes the section === "html"
          console.log("section >>");
          console.log(section);
          var sectionEl = $("section#" + section.type);
          var html = Vussion.compileTemplate("#"+ section.template, section);
          $(sectionEl).html(html).promise().done(function(){
            $("section#" + section.type).addClass("active");
          })
          Vussion.updateClients();
          break;

        case "video":
          var sectionEl = $("section#" + section.type);
          var html = Vussion.compileTemplate("#video-template", section);
          $(sectionEl).html(html).promise().done(function(){
            $("section#" + section.type).addClass("active");
            Vussion.vidplayer = videojs("#player" + section.id);
            $("#video-selector a").click(function(){
                Vussion.state.current.video = $(this).attr("href");
                console.log(Vussion.state.current.video);
                Vussion.videoChange(Vussion.state.current.video);
                Vussion.vidplayer.src(Vussion.state.current.video).play();
                return false;
            })
            Vussion.updateClients();
          })
          break;

        case "loading":
          $("section#" + section.type).addClass("active");
          Vussion.updateClients();
          break;
        default:
          console.log("hmmm I dont know what to do with this one.");
          break;
      }

      
      //Vussion.adminControl.slickGoTo(0);
      
    },
    loadContent: function(){

    }
  };  