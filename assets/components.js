
/*
 * 重置侧边栏位置
 *
 * TODO: 当有页头横幅并且其高度随着页面拉伸发生变化时，
 *       需要重新设置侧边栏位置
 */

(function() {
  var repositionSidebar, separateWidgets;

  repositionSidebar = function() {
    var $footer, $header, $sidebar, offsetTop;
    $sidebar = $(".Page-sidebar");
    $header = $(".Article-header");
    $footer = $(".Article-footer");
    if ($sidebar.size()) {
      if ($footer.size()) {
        offsetTop = $footer.offset().top - $header.offset().top + $footer.outerHeight(true) + 20;
      } else {
        offsetTop = $header.css("padding-top");
      }
      $sidebar.css("margin-top", offsetTop);
    }
    return $sidebar;
  };

  separateWidgets = function() {
    var $share, $widget, cls;
    cls = "is-separated";
    $share = $(".Widget--share");
    $widget = $share.next(".Widget");
    if ($widget.size() && $(".Widget-header", $widget).size() === 0) {
      $widget.addClass(cls);
    }
    if ($(".Widget").size() > 1) {
      return $(".Widget-header:first").closest(".Widget").addClass(cls);
    }
  };

  $(document).ready(function() {
    separateWidgets();
    return repositionSidebar();
  });

}).call(this);
(function() {
  var addTocItem, bindEvent, generateToc, getHeadingNo, initToc;

  getHeadingNo = function($h, tagName) {
    return $(tagName, $(".Article-content")).index($h) + 1;
  };

  addTocItem = function($h) {
    var id, idx, tagName;
    id = $h.attr("id");
    tagName = $h.get(0).tagName.toLowerCase();
    if (!id) {
      idx = getHeadingNo($h, tagName);
      id = (tagName === "h2" ? "h" : "subH") + "eading-" + idx;
      $h.attr("id", id);
    }
    return "<li><a href=\"#" + id + "\">" + ($h.text()) + "</a></li>";
  };

  generateToc = function() {
    var $item, $toc;
    $toc = $("<ul class=\"nav\" />");
    $item = null;
    $("h2:not([data-toc-skip]), h3:not([data-toc-skip])", $(".Article-content")).each(function() {
      var $h;
      $h = $(this);
      if (this.tagName.toLowerCase() === "h2") {
        $item = $(addTocItem($h));
        if ($("ul", $item).size() === 0) {
          $item.append("<ul class=\"nav\" />");
        }
        return $item.appendTo($toc);
      } else {
        return $("ul", $item).append(addTocItem($h));
      }
    });
    return $toc;
  };

  bindEvent = function($widget) {
    var $cnt, cls;
    cls = ".Widget--toc";
    $cnt = $(".Article-content");
    $widget.on({
      "affixed-top.bs.affix": function() {
        return $(this).css("position", "static");
      },
      "affixed.bs.affix": function() {
        return $(this).css("position", "fixed");
      }
    }).affix({
      offset: {
        top: $(cls).offset().top,
        bottom: function() {
          return $(document).height() - ($cnt.offset().top + $cnt.outerHeight(true));
        }
      }
    });
    return $("body").scrollspy({
      target: cls
    });
  };

  initToc = function($toc) {
    var cls;
    cls = ".Widget--toc";
    return bindEvent($(cls).find(".Widget-body").append($toc).closest(cls));
  };

  $(document).ready(function() {
    var $container, $toc, isExist;
    $container = $(".Widget--toc");
    if ($container.size() === 1) {
      $toc = $(".Widget-body > .nav", $container);
      isExist = $toc.size() !== 0;
      if (!isExist) {
        $toc = generateToc();
      }
      if ($("li", $toc).size() > 0) {
        if (isExist) {
          return bindEvent($container);
        } else {
          return initToc($toc);
        }
      } else {
        return $container.remove();
      }
    }
  });

}).call(this);
(function() {


}).call(this);
