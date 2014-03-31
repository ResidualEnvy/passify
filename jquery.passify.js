 /* jQueryUI Password Widget
 *
 * Copyright (c) 2014 Ryan Mulready (ryanmulready.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
(function($, undefined) {
	var $ = jQuery;
	
	$.widget('nv.passify', {
		options: {
			contains: {
				numeric:	1,
				lowercase:	0,
				uppercase:	0,
				symbol:		1,
			},
			regex: {
				numeric:	/\d/g,
				lowercase:	/[a-z]/g,
				uppercase:	/[A-Z]/g,
				symbol:		/[$-/:-?{-~!"^_`\[\]]/g,
			},
			dContain:	["password", "test"],
			minLen:		6,
			maxLen:		15,
			condition:	"numeric || symbol",
			errorMsg:	" Your password must contain at least 1 number or symbol"
		},
	 
		  _create: function () {
			  var self =	this;
			  var $self =	$(this.element);
			  
			  $self.die('keyup').live('keyup', function(){
				  var $input = 	$(this);
				  var $val =	$.trim($input.val());
				  
				  console.log(self._validate($val));
				  //console.log(self._score($val));
				  
			  });
		  },
		 _destroy: 	function () {},
		 
		 _score:	function(val){
			  var score = 		0;
			  var vCount = 		0;
			  var letters = 	new Object();
			  var variations =  {
				      digits: /\d/.test(val),
				      lower: /[a-z]/.test(val),
				      upper: /[A-Z]/.test(val),
				      nonWords: /\W/.test(val)
			  };
			  
			  if (!val)
			      return score;
			  
			  for (var i=0; i<val.length; i++) {
			      letters[val[i]] = (letters[val[i]] || 0) + 1;
			      score += 5.0 / letters[val[i]];
			  }
		
			  for (var check in variations) {
				  vCount += (variations[check] == true) ? 1 : 0;
			  }
			  
			  score += (vCount - 1) * 10;
		
			  return parseInt(score);
		 },
		 _validate:	function (val){
			  var self =		this;
			  var valLength =	val.length;
			  var validCheck =	self.options.condition;
			  var cCheck =		true;
			  var results = 	{
					  valid:	true,
					  error:	""
			  };
			  
			  $.each(self.options.contains, function(key, count){
				  var checkCount = (val.match(self.options.regex[key]) || []).length;
				  var checkValid = (checkCount >= count);
				  
				  if(!checkValid)
					  results.error = self.options.errorMsg;
				  validCheck = validCheck.replace(key, checkValid);		
			  });
					  
			  $.each(self.options.dContain, function(i, dval){
				  var $dval = 	$.trim(dval.toLowerCase());
				  var $fval =		$.trim(val.toLowerCase());
					
				  if($fval.indexOf($dval) > -1){
					  cCheck = false;
					  results.error += " Your password can not contain the word(s):"+self.options.dContain.join(", ");
				  }
				
			  });
			  
			  results.valid = (valLength >= self.options.minLen && valLength <= self.options.maxLen && eval(validCheck) && cCheck);
			  
					  
			  return results;
		 },
	 
	});
	
})(jQuery);