(()=>{var e={484:function(e){e.exports=function(){"use strict";var e=6e4,t=36e5,n="millisecond",i="second",s="minute",r="hour",a="day",l="week",o="month",u="quarter",d="year",c="date",v="Invalid Date",f=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,p=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,h={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var t=["th","st","nd","rd"],n=e%100;return"["+e+(t[(n-20)%10]||t[n]||t[0])+"]"}},_=function(e,t,n){var i=String(e);return!i||i.length>=t?e:""+Array(t+1-i.length).join(n)+e},m={s:_,z:function(e){var t=-e.utcOffset(),n=Math.abs(t),i=Math.floor(n/60),s=n%60;return(t<=0?"+":"-")+_(i,2,"0")+":"+_(s,2,"0")},m:function e(t,n){if(t.date()<n.date())return-e(n,t);var i=12*(n.year()-t.year())+(n.month()-t.month()),s=t.clone().add(i,o),r=n-s<0,a=t.clone().add(i+(r?-1:1),o);return+(-(i+(n-s)/(r?s-a:a-s))||0)},a:function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},p:function(e){return{M:o,y:d,w:l,d:a,D:c,h:r,m:s,s:i,ms:n,Q:u}[e]||String(e||"").toLowerCase().replace(/s$/,"")},u:function(e){return void 0===e}},y="en",b={};b[y]=h;var $=function(e){return e instanceof S},g=function e(t,n,i){var s;if(!t)return y;if("string"==typeof t){var r=t.toLowerCase();b[r]&&(s=r),n&&(b[r]=n,s=r);var a=t.split("-");if(!s&&a.length>1)return e(a[0])}else{var l=t.name;b[l]=t,s=l}return!i&&s&&(y=s),s||!i&&y},M=function(e,t){if($(e))return e.clone();var n="object"==typeof t?t:{};return n.date=e,n.args=arguments,new S(n)},D=m;D.l=g,D.i=$,D.w=function(e,t){return M(e,{locale:t.$L,utc:t.$u,x:t.$x,$offset:t.$offset})};var S=function(){function h(e){this.$L=g(e.locale,null,!0),this.parse(e)}var _=h.prototype;return _.parse=function(e){this.$d=function(e){var t=e.date,n=e.utc;if(null===t)return new Date(NaN);if(D.u(t))return new Date;if(t instanceof Date)return new Date(t);if("string"==typeof t&&!/Z$/i.test(t)){var i=t.match(f);if(i){var s=i[2]-1||0,r=(i[7]||"0").substring(0,3);return n?new Date(Date.UTC(i[1],s,i[3]||1,i[4]||0,i[5]||0,i[6]||0,r)):new Date(i[1],s,i[3]||1,i[4]||0,i[5]||0,i[6]||0,r)}}return new Date(t)}(e),this.$x=e.x||{},this.init()},_.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},_.$utils=function(){return D},_.isValid=function(){return!(this.$d.toString()===v)},_.isSame=function(e,t){var n=M(e);return this.startOf(t)<=n&&n<=this.endOf(t)},_.isAfter=function(e,t){return M(e)<this.startOf(t)},_.isBefore=function(e,t){return this.endOf(t)<M(e)},_.$g=function(e,t,n){return D.u(e)?this[t]:this.set(n,e)},_.unix=function(){return Math.floor(this.valueOf()/1e3)},_.valueOf=function(){return this.$d.getTime()},_.startOf=function(e,t){var n=this,u=!!D.u(t)||t,v=D.p(e),f=function(e,t){var i=D.w(n.$u?Date.UTC(n.$y,t,e):new Date(n.$y,t,e),n);return u?i:i.endOf(a)},p=function(e,t){return D.w(n.toDate()[e].apply(n.toDate("s"),(u?[0,0,0,0]:[23,59,59,999]).slice(t)),n)},h=this.$W,_=this.$M,m=this.$D,y="set"+(this.$u?"UTC":"");switch(v){case d:return u?f(1,0):f(31,11);case o:return u?f(1,_):f(0,_+1);case l:var b=this.$locale().weekStart||0,$=(h<b?h+7:h)-b;return f(u?m-$:m+(6-$),_);case a:case c:return p(y+"Hours",0);case r:return p(y+"Minutes",1);case s:return p(y+"Seconds",2);case i:return p(y+"Milliseconds",3);default:return this.clone()}},_.endOf=function(e){return this.startOf(e,!1)},_.$set=function(e,t){var l,u=D.p(e),v="set"+(this.$u?"UTC":""),f=(l={},l[a]=v+"Date",l[c]=v+"Date",l[o]=v+"Month",l[d]=v+"FullYear",l[r]=v+"Hours",l[s]=v+"Minutes",l[i]=v+"Seconds",l[n]=v+"Milliseconds",l)[u],p=u===a?this.$D+(t-this.$W):t;if(u===o||u===d){var h=this.clone().set(c,1);h.$d[f](p),h.init(),this.$d=h.set(c,Math.min(this.$D,h.daysInMonth())).$d}else f&&this.$d[f](p);return this.init(),this},_.set=function(e,t){return this.clone().$set(e,t)},_.get=function(e){return this[D.p(e)]()},_.add=function(n,u){var c,v=this;n=Number(n);var f=D.p(u),p=function(e){var t=M(v);return D.w(t.date(t.date()+Math.round(e*n)),v)};if(f===o)return this.set(o,this.$M+n);if(f===d)return this.set(d,this.$y+n);if(f===a)return p(1);if(f===l)return p(7);var h=(c={},c[s]=e,c[r]=t,c[i]=1e3,c)[f]||1,_=this.$d.getTime()+n*h;return D.w(_,this)},_.subtract=function(e,t){return this.add(-1*e,t)},_.format=function(e){var t=this,n=this.$locale();if(!this.isValid())return n.invalidDate||v;var i=e||"YYYY-MM-DDTHH:mm:ssZ",s=D.z(this),r=this.$H,a=this.$m,l=this.$M,o=n.weekdays,u=n.months,d=function(e,n,s,r){return e&&(e[n]||e(t,i))||s[n].slice(0,r)},c=function(e){return D.s(r%12||12,e,"0")},f=n.meridiem||function(e,t,n){var i=e<12?"AM":"PM";return n?i.toLowerCase():i},h={YY:String(this.$y).slice(-2),YYYY:this.$y,M:l+1,MM:D.s(l+1,2,"0"),MMM:d(n.monthsShort,l,u,3),MMMM:d(u,l),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:d(n.weekdaysMin,this.$W,o,2),ddd:d(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(r),HH:D.s(r,2,"0"),h:c(1),hh:c(2),a:f(r,a,!0),A:f(r,a,!1),m:String(a),mm:D.s(a,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:s};return i.replace(p,(function(e,t){return t||h[e]||s.replace(":","")}))},_.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},_.diff=function(n,c,v){var f,p=D.p(c),h=M(n),_=(h.utcOffset()-this.utcOffset())*e,m=this-h,y=D.m(this,h);return y=(f={},f[d]=y/12,f[o]=y,f[u]=y/3,f[l]=(m-_)/6048e5,f[a]=(m-_)/864e5,f[r]=m/t,f[s]=m/e,f[i]=m/1e3,f)[p]||m,v?y:D.a(y)},_.daysInMonth=function(){return this.endOf(o).$D},_.$locale=function(){return b[this.$L]},_.locale=function(e,t){if(!e)return this.$L;var n=this.clone(),i=g(e,t,!0);return i&&(n.$L=i),n},_.clone=function(){return D.w(this.$d,this)},_.toDate=function(){return new Date(this.valueOf())},_.toJSON=function(){return this.isValid()?this.toISOString():null},_.toISOString=function(){return this.$d.toISOString()},_.toString=function(){return this.$d.toUTCString()},h}(),E=S.prototype;return M.prototype=E,[["$ms",n],["$s",i],["$m",s],["$H",r],["$W",a],["$M",o],["$y",d],["$D",c]].forEach((function(e){E[e[1]]=function(t){return this.$g(t,e[0],e[1])}})),M.extend=function(e,t){return e.$i||(e(t,S,M),e.$i=!0),M},M.locale=g,M.isDayjs=$,M.unix=function(e){return M(1e3*e)},M.en=b[y],M.Ls=b,M.p={},M}()},646:function(e){e.exports=function(){"use strict";var e,t,n=1e3,i=6e4,s=36e5,r=864e5,a=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,l=31536e6,o=2592e6,u=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,d={years:l,months:o,days:r,hours:s,minutes:i,seconds:n,milliseconds:1,weeks:6048e5},c=function(e){return e instanceof y},v=function(e,t,n){return new y(e,n,t.$l)},f=function(e){return t.p(e)+"s"},p=function(e){return e<0},h=function(e){return p(e)?Math.ceil(e):Math.floor(e)},_=function(e){return Math.abs(e)},m=function(e,t){return e?p(e)?{negative:!0,format:""+_(e)+t}:{negative:!1,format:""+e+t}:{negative:!1,format:""}},y=function(){function p(e,t,n){var i=this;if(this.$d={},this.$l=n,void 0===e&&(this.$ms=0,this.parseFromMilliseconds()),t)return v(e*d[f(t)],this);if("number"==typeof e)return this.$ms=e,this.parseFromMilliseconds(),this;if("object"==typeof e)return Object.keys(e).forEach((function(t){i.$d[f(t)]=e[t]})),this.calMilliseconds(),this;if("string"==typeof e){var s=e.match(u);if(s){var r=s.slice(2).map((function(e){return null!=e?Number(e):0}));return this.$d.years=r[0],this.$d.months=r[1],this.$d.weeks=r[2],this.$d.days=r[3],this.$d.hours=r[4],this.$d.minutes=r[5],this.$d.seconds=r[6],this.calMilliseconds(),this}}return this}var _=p.prototype;return _.calMilliseconds=function(){var e=this;this.$ms=Object.keys(this.$d).reduce((function(t,n){return t+(e.$d[n]||0)*d[n]}),0)},_.parseFromMilliseconds=function(){var e=this.$ms;this.$d.years=h(e/l),e%=l,this.$d.months=h(e/o),e%=o,this.$d.days=h(e/r),e%=r,this.$d.hours=h(e/s),e%=s,this.$d.minutes=h(e/i),e%=i,this.$d.seconds=h(e/n),e%=n,this.$d.milliseconds=e},_.toISOString=function(){var e=m(this.$d.years,"Y"),t=m(this.$d.months,"M"),n=+this.$d.days||0;this.$d.weeks&&(n+=7*this.$d.weeks);var i=m(n,"D"),s=m(this.$d.hours,"H"),r=m(this.$d.minutes,"M"),a=this.$d.seconds||0;this.$d.milliseconds&&(a+=this.$d.milliseconds/1e3);var l=m(a,"S"),o=e.negative||t.negative||i.negative||s.negative||r.negative||l.negative,u=s.format||r.format||l.format?"T":"",d=(o?"-":"")+"P"+e.format+t.format+i.format+u+s.format+r.format+l.format;return"P"===d||"-P"===d?"P0D":d},_.toJSON=function(){return this.toISOString()},_.format=function(e){var n=e||"YYYY-MM-DDTHH:mm:ss",i={Y:this.$d.years,YY:t.s(this.$d.years,2,"0"),YYYY:t.s(this.$d.years,4,"0"),M:this.$d.months,MM:t.s(this.$d.months,2,"0"),D:this.$d.days,DD:t.s(this.$d.days,2,"0"),H:this.$d.hours,HH:t.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:t.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:t.s(this.$d.seconds,2,"0"),SSS:t.s(this.$d.milliseconds,3,"0")};return n.replace(a,(function(e,t){return t||String(i[e])}))},_.as=function(e){return this.$ms/d[f(e)]},_.get=function(e){var t=this.$ms,n=f(e);return"milliseconds"===n?t%=1e3:t="weeks"===n?h(t/d[n]):this.$d[n],0===t?0:t},_.add=function(e,t,n){var i;return i=t?e*d[f(t)]:c(e)?e.$ms:v(e,this).$ms,v(this.$ms+i*(n?-1:1),this)},_.subtract=function(e,t){return this.add(e,t,!0)},_.locale=function(e){var t=this.clone();return t.$l=e,t},_.clone=function(){return v(this.$ms,this)},_.humanize=function(t){return e().add(this.$ms,"ms").locale(this.$l).fromNow(!t)},_.milliseconds=function(){return this.get("milliseconds")},_.asMilliseconds=function(){return this.as("milliseconds")},_.seconds=function(){return this.get("seconds")},_.asSeconds=function(){return this.as("seconds")},_.minutes=function(){return this.get("minutes")},_.asMinutes=function(){return this.as("minutes")},_.hours=function(){return this.get("hours")},_.asHours=function(){return this.as("hours")},_.days=function(){return this.get("days")},_.asDays=function(){return this.as("days")},_.weeks=function(){return this.get("weeks")},_.asWeeks=function(){return this.as("weeks")},_.months=function(){return this.get("months")},_.asMonths=function(){return this.as("months")},_.years=function(){return this.get("years")},_.asYears=function(){return this.as("years")},p}();return function(n,i,s){e=s,t=s().$utils(),s.duration=function(e,t){var n=s.locale();return v(e,{$l:n},t)},s.isDuration=c;var r=i.prototype.add,a=i.prototype.subtract;i.prototype.add=function(e,t){return c(e)&&(e=e.asMilliseconds()),r.bind(this)(e,t)},i.prototype.subtract=function(e,t){return c(e)&&(e=e.asMilliseconds()),a.bind(this)(e,t)}}}()}},t={};function n(i){var s=t[i];if(void 0!==s)return s.exports;var r=t[i]={exports:{}};return e[i].call(r.exports,r,r.exports,n),r.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";const e="afterbegin";function t(e){const t=document.createElement("div");return t.innerHTML=e,t.firstElementChild}function i(e,t,n="beforeend"){t.insertAdjacentElement(n,e.getElement())}class s{getTemplate(){return'<form class="trip-events__trip-sort  trip-sort" action="#" method="get">\n    <div class="trip-sort__item  trip-sort__item--day">\n      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" checked>\n      <label class="trip-sort__btn" for="sort-day">Day</label>\n    </div>\n\n    <div class="trip-sort__item  trip-sort__item--event">\n      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>\n      <label class="trip-sort__btn" for="sort-event">Event</label>\n    </div>\n\n    <div class="trip-sort__item  trip-sort__item--time">\n      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">\n      <label class="trip-sort__btn" for="sort-time">Time</label>\n    </div>\n\n    <div class="trip-sort__item  trip-sort__item--price">\n      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">\n      <label class="trip-sort__btn" for="sort-price">Price</label>\n    </div>\n\n    <div class="trip-sort__item  trip-sort__item--offer">\n      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>\n      <label class="trip-sort__btn" for="sort-offer">Offers</label>\n    </div>\n  </form>'}getElement(){return this.element||(this.element=t(this.getTemplate())),this.element}removeElement(){this.element=null}}class r{getTemplate(){return'<form class="trip-filters" action="#" method="get">\n    <div class="trip-filters__filter">\n      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked disabled>\n      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>\n    </div>\n\n    <div class="trip-filters__filter">\n      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" disabled>\n      <label class="trip-filters__filter-label" for="filter-future">Future</label>\n    </div>\n\n    <div class="trip-filters__filter">\n      <input id="filter-present" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="present" disabled>\n      <label class="trip-filters__filter-label" for="filter-present">Present</label>\n    </div>\n\n    <div class="trip-filters__filter">\n      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" disabled>\n      <label class="trip-filters__filter-label" for="filter-past">Past</label>\n    </div>\n  </form>'}getElement(){return this.element||(this.element=t(this.getTemplate())),this.element}removeElement(){this.element=null}}class a{constructor({tripEvent:e}){this.tripEvent=e}getTemplate(){return(({type:e,eventDate:t,eventTitle:{destination:n,eventCity:i},offers:{offerPrice:s,offerTitle:r},eventSchedule:{dateFrom:a,dateTo:l,eventDuration:o},basePrice:u,isFavorite:d})=>`<ul class="trip-events__list">\n    <li class="trip-events__item">\n      <div class="event">\n        <time class="event__date" datetime=${t}>${t}</time>\n        <div class="event__type">\n          <img class="event__type-icon" width="42" height="42" src="img/icons/${e}.png" alt="Event type icon">\n        </div>\n        <h3 class="event__title">${n} ${i}</h3>\n        <div class="event__schedule">\n          <p class="event__time">\n            <time class="event__start-time" datetime=${a}>${a}</time>\n            &mdash;\n            <time class="event__end-time" datetime=${l}>${l}</time>\n          </p>\n          <p class="event__duration">${o}</p>\n        </div>\n        <p class="event__price">\n          &euro;&nbsp;<span class="event__price-value">${u}</span>\n        </p>\n        <h4 class="visually-hidden">Offers:</h4>\n        <ul class="event__selected-offers">\n          <li class="event__offer">\n            <span class="event__offer-title">${r}</span>\n            &plus;&euro;&nbsp;\n            <span class="event__offer-price">${s}</span>\n          </li>\n        </ul>\n        <button class="event__favorite-btn ${d?"event__favorite-btn--active":""}" type="button">\n          <span class="visually-hidden">Add to favorite</span>\n          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">\n            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>\n          </svg>\n        </button>\n        <button class="event__rollup-btn" type="button">\n          <span class="visually-hidden">Open event</span>\n        </button>\n      </div>\n    </li>\n  </ul>`)(this.tripEvent)}getElement(){return this.element||(this.element=t(this.getTemplate())),this.element}removeElement(){this.element=null}}class l{getTemplate(){return'<li class="trip-events__item">\n    <form class="event event--edit" action="#" method="post">\n      <header class="event__header">\n        <div class="event__type-wrapper">\n          <label class="event__type  event__type-btn" for="event-type-toggle-1">\n            <span class="visually-hidden">Choose event type</span>\n            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">\n          </label>\n          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">\n          <div class="event__type-list">\n            <fieldset class="event__type-group">\n              <legend class="visually-hidden">Event type</legend>\n              <div class="event__type-item">\n                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">\n                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>\n              </div>\n              <div class="event__type-item">\n                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">\n                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>\n              </div>\n              <div class="event__type-item">\n                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">\n                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>\n              </div>\n              <div class="event__type-item">\n                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">\n                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>\n              </div>\n              <div class="event__type-item">\n                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">\n                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>\n              </div>\n              <div class="event__type-item">\n                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>\n                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>\n              </div>\n              <div class="event__type-item">\n                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">\n                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>\n              </div>\n              <div class="event__type-item">\n                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">\n                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>\n              </div>\n              <div class="event__type-item">\n                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">\n                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>\n              </div>\n            </fieldset>\n          </div>\n        </div>\n        <div class="event__field-group  event__field-group--destination">\n          <label class="event__label  event__type-output" for="event-destination-1">\n            Flight\n          </label>\n          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Chamonix" list="destination-list-1">\n          <datalist id="destination-list-1">\n            <option value="Amsterdam"></option>\n            <option value="Geneva"></option>\n            <option value="Chamonix"></option>\n          </datalist>\n        </div>\n        <div class="event__field-group  event__field-group--time">\n          <label class="visually-hidden" for="event-start-time-1">From</label>\n          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">\n          &mdash;\n          <label class="visually-hidden" for="event-end-time-1">To</label>\n          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">\n        </div>\n        <div class="event__field-group  event__field-group--price">\n          <label class="event__label" for="event-price-1">\n            <span class="visually-hidden">Price</span>\n            &euro;\n          </label>\n          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">\n        </div>\n        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>\n        <button class="event__reset-btn" type="reset">Delete</button>\n        <button class="event__rollup-btn" type="button">\n          <span class="visually-hidden">Open event</span>\n        </button>\n      </header>\n      <section class="event__details">\n        <section class="event__section  event__section--offers">\n          <h3 class="event__section-title  event__section-title--offers">Offers</h3>\n          <div class="event__available-offers">\n            <div class="event__offer-selector">\n              <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>\n              <label class="event__offer-label" for="event-offer-luggage-1">\n                <span class="event__offer-title">Add luggage</span>\n                &plus;&euro;&nbsp;\n                <span class="event__offer-price">50</span>\n              </label>\n            </div>\n            <div class="event__offer-selector">\n              <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>\n              <label class="event__offer-label" for="event-offer-comfort-1">\n                <span class="event__offer-title">Switch to comfort</span>\n                &plus;&euro;&nbsp;\n                <span class="event__offer-price">80</span>\n              </label>\n            </div>\n            <div class="event__offer-selector">\n              <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">\n              <label class="event__offer-label" for="event-offer-meal-1">\n                <span class="event__offer-title">Add meal</span>\n                &plus;&euro;&nbsp;\n                <span class="event__offer-price">15</span>\n              </label>\n            </div>\n            <div class="event__offer-selector">\n              <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">\n              <label class="event__offer-label" for="event-offer-seats-1">\n                <span class="event__offer-title">Choose seats</span>\n                &plus;&euro;&nbsp;\n                <span class="event__offer-price">5</span>\n              </label>\n            </div>\n            <div class="event__offer-selector">\n              <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">\n              <label class="event__offer-label" for="event-offer-train-1">\n                <span class="event__offer-title">Travel by train</span>\n                &plus;&euro;&nbsp;\n                <span class="event__offer-price">40</span>\n              </label>\n            </div>\n          </div>\n        </section>\n        <section class="event__section  event__section--destination">\n          <h3 class="event__section-title  event__section-title--destination">Destination</h3>\n          <p class="event__destination-description">Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it\'s renowned for its skiing.</p>\n        </section>\n      </section>\n    </form>\n</li>'}getElement(){return this.element||(this.element=t(this.getTemplate())),this.element}removeElement(){this.element=null}}var o=n(484),u=n.n(o);const d=e=>e[Math.floor(Math.random()*e.length)],c=e=>Math.round(Math.random()*e),v=e=>u()(e).add(c(500),"minute"),f=["Taxi","Bus","Train","Ship","Drive","Flight","Check-in","Sightseeing","Restaurant"],p={DATE_MONTH:"MMM D",DATE:"YYYY-MM-DD",TIME:"HH:mm",DATE_TIME_SYSTEM:"YYYY-MM-DDTHH:mm",DATE_TIME:"YY/MM/DD HH:mm",DAY:"DD[d] HH[h] mm[m]",HOURS:"HH[h] mm[m]",MINUTES:"mm[m]"},h=(new Date,["Travel by train","Choose seats","Add meal","Switch to comfort","Add luggage"]);var _=n(646),m=n.n(_);const y=["Barcelona","Kyoto","Cape Town","Sydney","Venice","Rio de Janeiro","Dubai","Prague"];u().extend(m());const b=()=>{const{TIME:e,DATE_MONTH:t}=p,n=v(),i=v(n),s=d(f),r={offerTitle:d(h),offerPrice:c(300)},a=(()=>{const e=c(11),t=c(28);return`${["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][e]} ${t}`})(),l=u()(a).format(t),o=u()(n).format(e),_=u()(i).format(e),m=(e=>{const t=e.days(),n=e.hours(),i=e.minutes();return t>0?`${t}D ${n}H ${i}M`:n>0?`${n}H ${i}M`:`${i}M`})(u().duration(u()(i).diff(u()(n))));return{id:`${Date.now().toString(36)}-${Math.random().toString(36).substr(2,5)}`,eventDate:l,type:s,eventTitle:{destination:s,eventCity:d(y)},eventSchedule:{dateFrom:o,dateTo:_,eventDuration:m},offers:r,basePrice:r.offerPrice,isFavorite:Math.random()<.5}},$=new class{tripEvents=[];constructor(){for(let e=0;e<3;e++)this.tripEvents.push(b())}},g=new class{constructor({tripEventsModel:e}){this.tripFilterElement=document.querySelector(".trip-controls__filters"),this.tripEventsElement=document.querySelector(".trip-events"),this.wayPointList=document.createElement("ul"),this.wayPointList.classList.add("trip-events__list"),this.tripEventsElement.appendChild(this.wayPointList),this.tripEventsModel=e}renderFilter(){i(new r,this.tripFilterElement)}renderSorting(){i(new s,this.tripEventsElement,e)}renderTripEvents(){this.tripEventsModel.tripEvents.forEach((e=>{i(new a({tripEvent:e}),this.tripEventsElement)}))}renderEditForm(){i(new l,this.wayPointList,e)}init(){this.renderFilter(),this.renderSorting(),this.renderTripEvents(),this.renderEditForm()}}({tripEventsModel:$});g.init()})()})();
//# sourceMappingURL=bundle.121126a66fd6fb7b1f86.js.map