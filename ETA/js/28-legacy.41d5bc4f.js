"use strict";(self["webpackChunkvue_test2"]=self["webpackChunkvue_test2"]||[]).push([[28],{9028:function(t,e,r){r.r(e),r.d(e,{default:function(){return l}});var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"container"},[s("h4",[t._v(t._s(t.route)+" "+t._s(t.origin)+" 往 "+t._s(t.destination))]),s("div",{staticClass:"stop-list"},[s("table",{staticClass:"table text-left"},[t._m(0),s("tbody",t._l(t.current_route_stop_list,(function(e){return s("tr",{key:e.id,on:{click:function(r){return t.stop_click(e.seq)}}},[s("td",{staticClass:"td-seq"},[e.star?t._e():s("img",{attrs:{src:r(6101),width:"25px"},on:{click:function(r){return t.star_click(e.seq)}}}),e.star?s("img",{attrs:{src:r(8767),width:"25px"},on:{click:function(r){return t.star_click(e.seq)}}}):t._e(),s("span",[t._v(" "+t._s(e.seq))])]),s("td",[s("div",{class:[e.seq==t.stop_seq_clicked?"font-weight-bold":""]},[t._v(t._s(e.name_tc))]),t.stop_seq_clicked==e.seq?s("div",[e.eta_1||e.eta_2||e.eta_3||!t.eta_loaded?t._e():s("div",[t._v(" 暫時沒有預定班次 ")]),e.eta_1?s("div",[s("span",{staticClass:"eta-time-diff"},[t._v(t._s(e.eta_1.time_diff))]),s("span",{staticClass:"eta-time-diff-desc"},[t._v(" 分鐘")]),s("span",{staticClass:"eta-time"},[t._v(" ("+t._s(e.eta_1.time)+")")]),e.eta_1.rmk_tc?s("span",{staticClass:"eta-rmk"},[t._v(" ("+t._s(e.eta_1.rmk_tc)+")")]):t._e()]):t._e(),e.eta_2?s("div",[s("span",{staticClass:"eta-time-diff"},[t._v(t._s(e.eta_2.time_diff))]),s("span",{staticClass:"eta-time-diff-desc"},[t._v(" 分鐘")]),s("span",{staticClass:"eta-time"},[t._v(" ("+t._s(e.eta_2.time)+")")]),e.eta_2.rmk_tc?s("span",{staticClass:"eta-rmk"},[t._v(" ("+t._s(e.eta_2.rmk_tc)+")")]):t._e()]):t._e(),e.eta_3?s("div",[s("span",{staticClass:"eta-time-diff"},[t._v(t._s(e.eta_3.time_diff))]),s("span",{staticClass:"eta-time-diff-desc"},[t._v(" 分鐘")]),s("span",{staticClass:"eta-time"},[t._v(" ("+t._s(e.eta_3.time)+")")]),e.eta_3.rmk_tc?s("span",{staticClass:"eta-rmk"},[t._v(" ("+t._s(e.eta_3.rmk_tc)+")")]):t._e()]):t._e()]):t._e()])])})),0)])])])},i=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("thead",{staticClass:"thead-dark"},[r("tr",[r("th",[t._v("站數")]),r("th",[t._v("巴士站")])])])}],a=r(7673),n=r(6198),o=(r(1249),r(9826),r(1539),r(8783),r(3948),r(7327),r(561),r(8862),r(8638)),_={name:"KMB_ETA",data:function(){return{route:this.$route.params.route,bound:this.$route.params.bound,service_type:this.$route.params.service_type,origin:"",destination:"",stop_list:[],route_list:[],route_stop_list:[],current_route_stop_list:[],stop_seq_clicked:0,eta_loaded:!1}},computed:{star_image_src:function(){return this.current_route_stop_list.map((function(t){return t.star,"@/assets/star.png"}))}},mounted:function(){var t=this;(0,n.Z)((0,a.Z)().mark((function e(){var r;return(0,a.Z)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,o.Zt();case 2:t.route_list=JSON.parse(localStorage.getItem("KMBRouteList")),r=t.route_list.find((function(e){return e.route==t.route&&e.bound==t.bound&&e.service_type==t.service_type})),r?(t.origin=r.orig_tc,t.destination=r.dest_tc):t.$router.push({name:"KMB"});case 5:case"end":return e.stop()}}),e)})))(),(0,n.Z)((0,a.Z)().mark((function e(){var r,s;return(0,a.Z)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=[o.vw(),o.fO()],e.next=3,Promise.all(r);case 3:t.loadStop(),s=t.$route.query.seq,s&&t.stop_click(s);case 6:case"end":return e.stop()}}),e)})))(),setInterval((function(){t.eta_loaded&&t.stop_click(t.stop_seq_clicked)}),1e4)},methods:{loadStop:function(){var t=this,e=JSON.parse(localStorage.getItem("KMBRouteStopList")),r=JSON.parse(localStorage.getItem("KMBStopList")),s=e.filter((function(e){return e.route==t.route&&e.bound==t.bound&&e.service_type==t.service_type}));this.current_route_stop_list=s.map((function(t){var e=r.find((function(e){return e.stop==t.stop}));return e.stop&&(t.name_tc=e.name_tc),t}));var i=JSON.parse(localStorage.getItem("KMBRouteStopStar"));i&&(this.current_route_stop_list=this.current_route_stop_list.map((function(t){var e=i.find((function(e){return e.route==t.route&&e.bound==t.bound&&e.service_type==t.service_type&&e.seq==t.seq}));return t.star=!!e,t})))},stop_click:function(t){var e=this;this.stop_seq_clicked=t,(0,n.Z)((0,a.Z)().mark((function r(){var s,i,n,_;return(0,a.Z)().wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,o.I0(e.route,e.service_type);case 2:s=r.sent,s=s.data,i=s.find((function(r){return r.route==e.route&&r.dir==e.bound&&r.service_type==e.service_type&&r.seq==t&&1==r.eta_seq})),n=s.find((function(r){return r.route==e.route&&r.dir==e.bound&&r.service_type==e.service_type&&r.seq==t&&2==r.eta_seq})),_=s.find((function(r){return r.route==e.route&&r.dir==e.bound&&r.service_type==e.service_type&&r.seq==t&&3==r.eta_seq})),e.eta_loaded=!0,e.current_route_stop_list=e.current_route_stop_list.map((function(t){return i&&i.eta&&(t.eta_1=i,t.eta_1.time=o.mr(i.eta),t.eta_1.time_diff=o.pm(i.eta)),n&&n.eta&&(t.eta_2=n,t.eta_2.time=o.mr(n.eta),t.eta_2.time_diff=o.pm(n.eta)),_&&_.eta&&(t.eta_3=_,t.eta_3.time=o.mr(_.eta),t.eta_3.time_diff=o.pm(_.eta)),t})),e.eta_loaded=!0;case 10:case"end":return r.stop()}}),r)})))()},star_click:function(t){var e=this,r={route:e.route,bound:e.bound,service_type:e.service_type,seq:t},s=localStorage.getItem("KMBRouteStopStar");s=JSON.parse(s),s||(s=[]);for(var i=-1,a=0;a<s.length;a++)if(s[a].route==r.route&&s[a].bound==r.bound&&s[a].service_type==r.service_type&&s[a].seq==r.seq){i=a;break}if(i>-1){s.splice(i,1);for(var n=0;n<this.current_route_stop_list.length;n++){var o=this.current_route_stop_list[n];if(o.route==r.route&&o.bound==r.bound&&o.service_type==r.service_type&&o.seq==r.seq){this.current_route_stop_list[n].star=!1;break}}}else{s.push(r);for(var _=0;_<this.current_route_stop_list.length;_++){var c=this.current_route_stop_list[_];if(c.route==r.route&&c.bound==r.bound&&c.service_type==r.service_type&&c.seq==r.seq){this.current_route_stop_list[_].star=!0;break}}}localStorage.setItem("KMBRouteStopStar",JSON.stringify(s))}}},c=_,u=r(1001),p=(0,u.Z)(c,s,i,!1,null,"3f9bc95a",null),l=p.exports},7327:function(t,e,r){var s=r(2109),i=r(2092).filter,a=r(1194),n=a("filter");s({target:"Array",proto:!0,forced:!n},{filter:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}})},9826:function(t,e,r){var s=r(2109),i=r(2092).find,a=r(1223),n="find",o=!0;n in[]&&Array(1)[n]((function(){o=!1})),s({target:"Array",proto:!0,forced:o},{find:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),a(n)},561:function(t,e,r){var s=r(2109),i=r(7854),a=r(1400),n=r(9303),o=r(6244),_=r(7908),c=r(5417),u=r(6135),p=r(1194),l=p("splice"),d=i.TypeError,f=Math.max,v=Math.min,m=9007199254740991,h="Maximum allowed length exceeded";s({target:"Array",proto:!0,forced:!l},{splice:function(t,e){var r,s,i,p,l,g,k=_(this),y=o(k),b=a(t,y),q=arguments.length;if(0===q?r=s=0:1===q?(r=0,s=y-b):(r=q-2,s=v(f(n(e),0),y-b)),y+r-s>m)throw d(h);for(i=c(k,s),p=0;p<s;p++)l=b+p,l in k&&u(i,p,k[l]);if(i.length=s,r<s){for(p=b;p<y-s;p++)l=p+s,g=p+r,l in k?k[g]=k[l]:delete k[g];for(p=y;p>y-s+r;p--)delete k[p-1]}else if(r>s)for(p=y-s;p>b;p--)l=p+s-1,g=p+r-1,l in k?k[g]=k[l]:delete k[g];for(p=0;p<r;p++)k[p+b]=arguments[p+2];return k.length=y-s+r,i}})},6101:function(t,e,r){t.exports=r.p+"img/star.5f894ed9.png"},8767:function(t,e,r){t.exports=r.p+"img/starred.5d1433f5.png"}}]);
//# sourceMappingURL=28-legacy.41d5bc4f.js.map