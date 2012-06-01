function showPhotosByGroup(json) {

	var i=0;
	var photoURL ='http://176.34.237.117/riak/photos/';
	var faceDetectionURL = '../_html/faceTrain.html?url=';
	
	// reading url params
	var url = window.location.href;
	var param = parseURLParams(url);
	var groupNumber = String(param['group']);
	var seconds = String(param['seconds']);
	
	for (var propertyName in json){
		
		var ii=0;
		var avatarPhotos = [];
		var midsizedPhotos =[];
		var extendedPhotos = [];
		var photoDate = [];
		var photoID = [];
		var photoPropertyHidden = [];
		var photoPropertyGroupNumber = [];
		
		for(var propertyName in json[i]){
			
			avatarPhotos[ii] = photoURL + json[i][ii].images.avatar; //.wap_w .avatar .profile_h
			midsizedPhotos[ii] = photoURL + json[i][ii].images.profile_h;//.wap_w;
			extendedPhotos[ii] = photoURL + json[i][ii].images.extended;  //.extended .standard
			photoDate[ii] = json[i][ii].date; // getting time of image
			photoID[ii] = json[i][ii].id; // getting ID of image
			
			photoPropertyHidden[ii] = 'NA';
			photoPropertyGroupNumber[ii] = 'NA';
			
			
			// checking all 'properties' to find necessary
			for (iii=0;iii<json[i][ii].properties.length;iii++){
				
				if (json[i][ii].properties[iii].hidden === 'Y') {
					photoPropertyHidden[ii] = json[i][ii].properties[iii].hidden;
				} 
				
				if (typeof json[i][ii].properties[iii].groupNumber != 'undefined'){
					photoPropertyGroupNumber[ii] = json[i][ii].properties[iii].groupNumber;
				}
			}
			
			// checking for pictures with desired group number
			if (photoPropertyHidden[ii] !='Y' && photoPropertyGroupNumber[ii] === groupNumber) {
				
				// adding images to main div
				$('div.main').append('<a class="images" id="img' + photoID[ii] + '" target="_blank" href="' + faceDetectionURL + extendedPhotos[ii] 
				+ '" rel="images"><img alt="" src="' + midsizedPhotos[ii] + '"></a>');
			
				// adding data to images
				$('a#img' + photoID[ii])
					.data('date', photoDate[ii])
					.data('id', photoID[ii])
					.data('midsizedPhoto', midsizedPhotos[ii])
					.data('extendedPhoto', extendedPhotos[ii])
					.data('groupNumber', photoPropertyGroupNumber[ii]);
			}
			
			ii++;

		} // end for
		i++;
	} // end for
	
	if (seconds === '0'){
		var seconds = calculateSeconds(16);	
	}
	
	produceSummaryGroups(seconds);
	
} // end function

// divides photos into summary groups
function produceSummaryGroups(seconds){
	
	var dates =[];
	var timeDiff = [];
	var breakTime = seconds;
	var breakDiv = '<div class="break"></div>'
	
	$('div.main a').each(function(i){
	
		dates[i] = $(this).data('date');
		if (i==0) {
			timeDiff[i] = 0;
		} else {
			timeDiff[i] = dates[i] - dates[i-1];
		}
		if (timeDiff[i]>breakTime) {
			$(this).before(breakDiv); // adding break div	
		} 
	}); // end each
	
	produceSummaryGroupsDivs();
}

// moves pictures into divs
function produceSummaryGroupsDivs(){
	
	var divs =[];

	$('div.break').each(function(i){
		divs[i] = $(this);
		$('div.break ~ *').each(function(ii){
	
			if ($(this).is(".break")) {
          	return false;
        	}
			
			$(this).appendTo(divs[i]);
			$(divs[i]).attr('class','images').attr('id','set'+ i); 
		}); // end each	
	}); // end each
	setElements();
}

// adjusting html elements
function setElements(){
	
	// hidding all images
	$('div.images img').addClass('hidden');
	
	// adding navigation and unhiding one random image in each div
	$('div.images').each(function() {
		
		var set = $(this).attr('id');
		var target = "div#" + set + " img"; //creating target = "div#set0 img"
		var size = $(target).size();
	
		//adding navigation div with buttons
		var sizeLabel = '<a id="select" href="#set"><input class="navigation" id="select" type="button" value="" /></a>';
		var prevButton = '<input class="navigation" id="prev" type="button" value="<" />';
 		var nextButton = '<input class="navigation" id="next" type="button" value=">" />';
 		var randButton = '<input class="navigation" id="rand" type="button" value="rand" />';
 		var navigationDiv = '<div class="navigation">'  + prevButton + nextButton + randButton + sizeLabel + '</div>';
		$(this).append(navigationDiv);
		$(this).find('input#select').val(size);//changes value of select button to number of images
		
		//checking to disable buttons in case of only one image
		if (size < 2) {
			$(this).find('input.navigation').attr('disabled', 'disabled');
		}
		
		//unhiding one random image
		var p = randPic(target);
		$(target+':eq(' + p + ')').removeClass('hidden').addClass('visible');
		
	}); // end each
	
	// adding events on navigation buttons
	clickRandButton('input#rand');	
	clickNextButton('input#next');
	clickPrevButton('input#prev');
	clickSelectButton('input#select');
	
	// adding click event on group button
	$('div.forms input#group').click(function(){
		var targetNumberOfGroups = $('div.forms input#number').val();
		var seconds = calculateSeconds(targetNumberOfGroups);
		var groupNumber = $('a.images:first').data('groupNumber');
		var addr = '../_html/summary.html?group=' + groupNumber + '&seconds=' + seconds;
		window.location.href = addr;
	});
	
	// adding click event on group2 button
	$('div.forms input#group2').click(function(){
		var seconds = $('div.forms input#seconds').val();
		var groupNumber = $('a.images:first').data('groupNumber');
		var addr = '../_html/summary.html?group=' + groupNumber + '&seconds=' + seconds;
		window.location.href = addr;
	});
	
	// button for testing purposes
	$('div.forms input#test').click(function(e){
		//e.preventDefault();
		/*
		$('div#set2 a').clone().appendTo('div#zoom');
		$('div#zoom img').removeClass('hidden').addClass('visible');
		$('div#zoom').offset({ top: 285, left: 318 });
		$('div#zoom img').click(function(e){
			e.preventDefault();
			console.log($(this).parent().index());
			//$('div#zoom a').remove();
			//$('div.main').css('opacity', '1');
		});
		$('div.main').css('opacity', '0.5');
		*/
		/*
		$('div.main').after('<div id="zoom" style="display: none"><div id="set"></div></div>"');
		$('div#set7 a').clone().appendTo('div#zoom div#set');
		$('div#set img').removeClass('hidden').addClass('visible');
		$('div#set img').click(function(e){
			e.preventDefault();
			var ind = $(this).parent().index();
			changePic('div#set7', ind);
			$.fancybox.close();
			//$('div#zoom a').remove();
			//$('div.main').css('opacity', '1');
		});
		$('a#test').fancybox({
			'width' : 900,
			'height': 700,
			'autoDimensions' : false,
			'onClosed' : function(){$('div#zoom').remove();}	
		});
		*/
	});

} // end setElements

function randPic(target){
	var size = $(target).size();
	var rand = Math.floor(Math.random()*size);
	return rand;
}	
	
function clickRandButton(target){	
	$(target).click(function(){
		
		var set = $(this).parent().parent().attr('id');
		var size = $('div#' + set + ' img').size();
		
		if (size > 1) {
		
			var p = randPic('div#' + set + ' img');
			var img1 = $('div#' + set + ' img.visible').attr('src');
			var img2 = $('div#' + set + ' img:eq('+ p +')').attr('src');
	
			while (img1 == img2) {
				var p = randPic('div#' + set + ' img');
				var img2 = $('div#' + set + ' img:eq('+ p +')').attr('src');
			}
			
			$('div#' + set + ' img.visible').removeClass('visible').addClass("hidden");
			$('div#' + set + ' img:eq('+ p +')').removeClass('hidden').addClass('visible');
		} // end if
	});//end click
}

function clickNextButton(target){	
	$(target).click(function(){
		
		var set = $(this).parent().parent().attr('id');
		var list = $('div#' + set + ' img');
		var size = list.size();
		var img = $('div#' + set + ' img.visible');
		
		if (size > 1) {
		
			var ind = list.index(img);
			ind++;
			
			if (ind === size) {
				var ind = 0;
			}
			
			img.removeClass('visible').addClass('hidden');
			$('div#' + set + ' img:eq('+ ind +')').removeClass('hidden').addClass('visible');
		
		} // end if
	});//end click
}

function clickPrevButton(target){	
	$(target).click(function(){
		
		var set = $(this).parent().parent().attr('id');
		var list = $('div#' + set + ' img');
		var size = list.size();
		var img = $('div#' + set + ' img.visible');
		
		if (size > 1) {
		
			var ind = list.index(img);
			ind--;
			
			if (ind < 0) {
				var ind = size-1;
			}
			
			img.removeClass('visible').addClass('hidden');
			$('div#' + set + ' img:eq('+ ind +')').removeClass('hidden').addClass('visible');
		
		} // end if
	});//end click
}

function clickSelectButton(target){
	$(target).click(function(){
		
		$('div.main').after('<div id="temp" style="display: none"><div id="set"></div></div>');// adds temp div to open fancybox
		var divId = $(this).parents('div.images').attr('id');
		$('div#' + divId + ' a.images').clone().appendTo('div#temp div#set');// copies all images from selected div to temp div
		$('div#set img').removeClass('hidden').addClass('visible');// makes all images visible
		$('div#set img').click(function(e){
			e.preventDefault();
			var ind = $(this).parent().index();
			changePic('div#' +divId, ind);
			$.fancybox.close();
		});
		$('a#select').fancybox({
			'width' : 900,
			'height': 700,
			'autoDimensions' : true,
			'autoScale' : true,
			'onClosed' : function(){$('div#temp').remove();}	
		});
		
	});
}


function getAllDates(){
	
	var dates = [];
	
	$('div.main a.images').each(function(i) {
		dates[i] = $(this).data('date');
	});
	
	return dates;
}

function getTimeDifferences(){
	
	var dates = getAllDates();
	var timeDifferences = [];
	
	for (i=1; i<dates.length; i++){
		var td = dates[i] - dates[i-1];
		timeDifferences.push(td);
	}
	
	return timeDifferences;
}

function calculateSeconds(targetNumberOfGroups){

	var timeDifferences = getTimeDifferences();
	var sortedTimeDifferences = timeDifferences.sort(function(a,b){return b - a}); //sorted from max to min
	var numberOfTimeDifferences = timeDifferences.length;
	
	if (targetNumberOfGroups < numberOfTimeDifferences) {
		var seconds = sortedTimeDifferences[targetNumberOfGroups-1];	
	} else {
		var seconds = sortedTimeDifferences[numberOfTimeDifferences-1]-1;
	}
	
	return seconds;
}

/*
function hoverPic(target){
	$(target).hover(function(e){
	$(this).toggleClass('over');
	});	
}
*/

function changePic(target, index){
	$(target +' img.visible').removeClass('visible').addClass('hidden');
	$(target +' img:eq(' + index + ')').removeClass('hidden').addClass('visible');
}




