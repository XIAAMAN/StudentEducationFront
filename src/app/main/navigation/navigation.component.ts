import { Component, OnInit } from '@angular/core';
// import * as  form 'types/jquery';
declare const my:any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: [ './navigation.component.css']
})
export class NavigationComponent implements OnInit {
  parentPermisList: [{
    permisId: null,
    permisParentId: null,
    permisName: null,
    permisNameValue: null,
    permisType: null,
    permisPosition: null,
    permisIcon: null,
    permisUrl: null,
    permisDescription: null,
    childrenPermisList: [{
      permisId: null,
      permisParentId: null,
      permisName: null,
      permisNameValue: null,
      permisType: null,
      permisPosition: null,
      permisIcon: null,
      permisUrl: null,
      permisDescription: null
    }]
  }];
  constructor() { }

  ngOnInit() {

    this.parentPermisList = JSON.parse(window.sessionStorage.getItem('parentPermisList'));
    // console.log("navigation : ", this.parentPermisList)
    // $('#test').click(function() {
    //   alert(1111);
    // });
    var maxHeight = 400;

    $(function(){

      $(".dropdown > li").hover(function() {

        var $container = $(this),
          $list = $container.find("ul"),
          $anchor = $container.find("a"),
          height = $list.height() * 1.1,       // make sure there is enough room at the bottom
          multiplier = height / maxHeight;     // needs to move faster if list is taller

        // need to save height here so it can revert on mouseout
        $container.data("origHeight", $container.height());

        // so it can retain it's rollover color all the while the dropdown is open
        $anchor.addClass("hover");

        // make sure dropdown appears directly below parent list item
        $list
          .show()
          .css({
            paddingTop: $container.data("origHeight")
          });

        // don't do any animation if list shorter than max
        // if (multiplier > 1) {
        //   $container
        //     .css({
        //       height: maxHeight,
        //       overflow: "hidden"
        //     })
        //     .mousemove(function(e) {
        //       var offset = $container.offset();
        //       var relativeY = ((e.pageY - offset.top) * multiplier) - ($container.data("origHeight") * multiplier);
        //       if (relativeY > $container.data("origHeight")) {
        //         $list.css("top", -relativeY + $container.data("origHeight"));
        //       };
        //     });
        // }

      }, function() {

        var $el = $(this);

        // put things back to normal
        $el
          .height($(this).data("origHeight"))
          .find("ul")
          .css({ top: 0 })
          .hide()
          .end()
          .find("a")
          .removeClass("hover");

      });

    });
  }

}
