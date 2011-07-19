(function($, undefined){
	$.fn.footnotify = function(options) {
		//did we find any footnotes?
		if (this.length) {
			//yup, start a counter
			var i = 1,
				footnotes = {};
			//and get our options
			var settings = {
				footnoteCallout : "<sup class=\"footnote\" id=\"##footnotecalloutid##\"><a href=\"##footnoteid##\">##footnotecallout##</a></sup>",
				footnote : "<li id=\"##footnoteidmask##\">##footnotecallout##. ##footnotetext####backlink##</li>",
				footnoteID : "footnote-##id##",
				footnoteCalloutID : "footnote-callout-##id##",
				backLink : " <a href=\"##footnotecalloutidmask##\">↑</a>",
				combineFootnotes : true,
				calloutType : 'decimal',
				footnoteContainer : "<ol class=\"footnotes\"></ol>",
				debug : false
			};
			if (options) { 
				$.extend( settings, options );
			}
			//have we got a target for our footnotes?
			if (settings.footnoteTarget === undefined) {
				if (settings.debug) {
					throw "Footnotify() requires a footnoteTarget selector.";
				} else {
					return this;
				}

			}
			var footnotesContainer = $(settings.footnoteTarget);
			if (!footnotesContainer.length) {
				if (settings.debug) {
					throw "Footnotify() requires a footnoteTarget element.";
				} else {
					return this;
				}
			}
			footnotesContainer = $(settings.footnoteContainer).appendTo(footnotesContainer);
		}
		function romanize(N,s,b,a,o,t){
		  t=N/1e3|0;N%=1e3;
		  for(s=b='',a=5;N;b++,a^=7)
		    for(o=N%a,N=N/a^0;o--;)
		      s='IVXLCDM'.charAt(o>2?b+N-(N&=~1)+(o=1):b)+s;
		  return Array(t+1).join('M')+s;
		}
		function toAlpha(int){
			if (int > 26 && settings.debug) {
				throw "Footnotify() ran out of letters. Consider a different CalloutType."
			}
			return String.fromCharCode(64 + int);
		}
		return this.each(function() {
			var $this = $(this),
				currCallout = i,
				footnoteText = $this.attr('title'),
				newFootnote = true;
			if (settings.combineFootnotes) {
				for (item in footnotes) {
					if (footnotes[item] == footnoteText) {
						currCallout = parseInt(item,10);
						newFootnote = false;
						break;
					}
				}
				if (newFootnote) {
					footnotes[currCallout] = footnoteText;
				}
			}
			
			var footnoteID = settings.footnoteID.replace('##id##',currCallout),
				footnoteCalloutID = settings.footnoteCalloutID.replace('##id##',currCallout);
				if (settings.combineFootnotes) {
					settings.backLink = false;
				}
			//callout
			if ($.isArray(settings.calloutType)) {
				if ((currCallout) > settings.calloutType.length) {
					if (settings.debug) {
						throw "Footnotify() ran out of custom callout types. Consider adding more, or using a different CalloutType.";	
					}
				}
				currCallout = settings.calloutType[currCallout-1];
			} else {
				switch (settings.calloutType) {
					case 'upper-roman':
						currCallout = romanize(currCallout);
						break;
					case 'lower-roman':
						currCallout = romanize(currCallout).toLowerCase();
						break;
					case 'upper-alpha':
						currCallout = toAlpha(currCallout);
						break;
					case 'lower-alpha':
						currCallout = toAlpha(currCallout).toLowerCase();
						break;
					default:
						//decimal - do nothing
				}						
			}
			$this.replaceWith(settings.footnoteCallout.replace('##footnotecalloutid##',settings.footnoteCalloutID).replace('##footnoteid##',footnoteID).replace('##footnotecallout##',currCallout));
			//footnote
			var footnote = settings.footnote.replace('##footnoteidmask##',footnoteID).replace('##footnotetext##',footnoteText).replace('##footnotecallout##',currCallout);
			if (settings.backLink !== false) {
				footnote = footnote.replace('##backlink##',settings.backLink.replace('##footnotecalloutidmask##',footnoteCalloutID));
			} else {
				footnote = footnote.replace('##backlink##','');
			}
			if (!settings.combineFootnotes || newFootnote) {
				footnotesContainer.append(footnote);						
			}
			i++;
		});
	}
})(jQuery);