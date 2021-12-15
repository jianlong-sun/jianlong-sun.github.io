// 样式
import '../css/main.scss'
// 上报
import './report'
// 图片查看器
import Viewer from './viewer'
// 分享
import Share from './share'
// 边缘
import Aside from './aside'

import {addLoadEvent} from './util'

addLoadEvent(function() {
	Share.init()
	Viewer.init()
	Aside.init()
  if($(".instagram").length) {
    require(['/js/photo.js', '/fancybox/jquery.fancybox.js', '/js/jquery.lazyload.js'], function(obj) {
      obj.init();
    });
  }
})

