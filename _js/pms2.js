//===================VARIABLES=====================
var breakSimilar = '<div class="similar"></div>';
var breakGroup = '<div class="break"></div>';
//=================================================

function setPhotoProperty(id, propertyName, propertyValue){		

	var userID = '?user_id=2';
	var photoID = '&id=' + id;
	var property = '&prop.' + propertyName + '=' + propertyValue;
	var url = 'http://176.34.237.117/json/photo_update' + userID + photoID + property;
	
	$.ajax(url,{
		cache: false,
		dataType: 'json',
		timeout: 30000,
		success: function(json){reportSetPhotoProperty(json, id, propertyName, propertyValue)},
		error: showError
	}); // end ajax
} // end function

function reportSetPhotoProperty(json,id, propertyName,propertyValue) {

	console.log('Property(' + propertyName + ':' + propertyValue + ')');
	$('a#img'+id).data(propertyName, propertyValue); 
}

function deletePhoto(id){		

	var userID = '2';
	
	$.ajax('http://176.34.237.117/json/photo_delete',{
		data: {
			'user_id' : userID,
			'id' : id
			},
		cache: false,
		dataType: 'json',
		timeout: 30000,
		success: reportDelete,
		error: showError
	}); // end ajax
} // end function

function reportDelete(json) {
	console.log('Deleted!');
}

function getPhotosAll(seconds, callback){		

	var userID = '2';
	var timePeriod = seconds;
	
	$.ajax('http://176.34.237.117/json/photo_groups',{
		data: {
			'user_id' : userID,
			'time' : timePeriod
			},
		cache: false,
		dataType: 'json',
		timeout: 30000,
		success: callback, //showPhotosAll,
		error: showError
	}); // end ajax
} // end function

// reads face data and stores it to property in DB
function saveFaceData(json){
	
	var status = json.status;

	if (status == 'failure') {
		console.log('error: ' + json.error_code + '->'+ json.error_message);
	} // end if

	if (status == 'success') {
	
		var propertyName = 'faceData'; // property name under which to be stored in DB
		var images = json.photos;
	
		$.each(images, function(i,v){
			
			var faceProperties = [];
			
			// getting photo url
			var url = v.url;
			
			// extracting photo id from url
			var idStart = url.indexOf("=") + 1;
  			var idEnd = url.length + 1;
  			var id = url.slice(idStart, idEnd - 1);
  			
			// getting number of faces
  			faceProperties.push('numberOfFaces', v['tags'].length);
		
  			// reading TAGS
  			$.each(v.tags, function(ii,v){
			
  				faceProperties.push('face_' + ii + '_tid', v['tid']);
  				faceProperties.push('face_' + ii + '_recognizable', v['recognizable']);
  				faceProperties.push('face_' + ii + '_threshold', v['threshold']);
				faceProperties.push('face_' + ii + '_yaw', v['yaw']);  				
				faceProperties.push('face_' + ii + '_roll', v['roll']);  				
				faceProperties.push('face_' + ii + '_pitch', v['pitch']);  				
				faceProperties.push('face_' + ii + '_confidence', v['attributes']['face']['confidence']);  				
				faceProperties.push('face_' + ii + '_numberOfUids', v['uids'].length);
				faceProperties.push('face_' + ii + '_width', v['width']);
				faceProperties.push('face_' + ii + '_height', v['height']);
				faceProperties.push('face_' + ii + '_center_x', v['center']['x']);
				faceProperties.push('face_' + ii + '_center_y', v['center']['y']);
				// reading UIDS
  				$.each(v.uids,function(iii,v){
  					faceProperties.push('face_' + ii + '_uid_' + iii, v['uid']);
  					faceProperties.push('face_' + ii + '_uid_confidence_' + iii, v['confidence']);
  				});
  			});

  		// writing property info into DB
		setPhotoProperty(id, propertyName, faceProperties.toString());
		// outputing debugging info
		//console.log(faceProperties.toString());
		});
	}
}
// =============================== DRAFT ONLY. NOT FINISHED. NEEDS REVIEW ================================
function getPhotoInfo(id, callback, propertyName){		

	var userID = '2';
	
	$.ajax('http://176.34.237.117/json/photo',{
		data: {
			'user_id' : userID,
			'id' : id
			},
		cache: false,
		dataType: 'json',
		timeout: 30000,
		success: function(json){callback(json, propertyName)},
		error: showError
	}); // end ajax
} // end function

// a possible callback function for getPhotoInfo
function showPhotoInfo(json, propertyName){
	console.log('PhotoInfo'); // change code here...
	console.log(propertyName);
	
	var properties = json.properties;
	$.each(properties, function(i,v){
		var propertyValue = v[propertyName];
		if (typeof propertyValue != 'undefined'){
			console.log(propertyValue);
			
			var splitPropertyValue = propertyValue.split(',');
			console.log(splitPropertyValue);
			var faces = splitPropertyValue.lastIndexOf('numberOfFaces');
			console.log(faces);
			console.log(splitPropertyValue[faces+1]);
			//var end = propertyValue[pos].length + 1; 
			//var face = propertyValue[pos].slice(start, end -1);
			
			/*
			var idStart = url.indexOf("numberOfFaces=") + 1;
  			var idEnd = url.length + 1;
  			var id = url.slice(idStart, idEnd - 1);	
			*/
		}
			
	});
}
//========================================================================================================


function showPhotosAll(json) {

	var i=0;
	var photoURL ='http://176.34.237.117/riak/photos/';
	var faceDetectionURL = '../_html/faceTrain.html?url=';
	
	for (var propertyName in json){
		
		var ii=0;
		var avatarPhotos = [];
		var midsizedPhotos =[];
		var extendedPhotos = [];
		var photoDate = [];
		var photoID = [];
		var photoPropertyHidden = [];
		var photoPropertyGroupNumber = [];
		var photoPropertyFaceData = [];
		
		for(var propertyName in json[i]){
			
			avatarPhotos[ii] = photoURL + json[i][ii].images.avatar; //.wap_w .avatar .profile_h
			midsizedPhotos[ii] = photoURL + json[i][ii].images.profile_h;
			extendedPhotos[ii] = photoURL + json[i][ii].images.extended;  //.extended .standard
			photoDate[ii] = json[i][ii].date; // getting time of image
			photoID[ii] = json[i][ii].id; // getting ID of image
			
			photoPropertyHidden[ii] = 'NA';
			photoPropertyGroupNumber[ii] = 'NA';
			photoPropertyFaceData[ii] = 'NA';
			
			// checking all 'properties' to find necessary
			for (iii=0;iii<json[i][ii].properties.length;iii++){
				
				if (json[i][ii].properties[iii].hidden === 'Y') {
					photoPropertyHidden[ii] = json[i][ii].properties[iii].hidden;
				} 
				
				if (typeof json[i][ii].properties[iii].groupNumber != 'undefined'){
					photoPropertyGroupNumber[ii] = json[i][ii].properties[iii].groupNumber;
				}
				
				if (typeof json[i][ii].properties[iii].faceData != 'undefined'){
					photoPropertyFaceData[ii] = json[i][ii].properties[iii].faceData;
				}
			}
			
			// adding images to main div
			$('div.main').append('<a class="images" id="img' + photoID[ii] + '" target="_blank" href="' + faceDetectionURL + extendedPhotos[ii] 
			+ '" rel="images"><img alt="" src="' + avatarPhotos[ii] + '"></a>');
			
			// adding action if hidden property
			if (photoPropertyHidden[ii] ==='Y') {
				$('a#img' + photoID[ii]).children().addClass('property_hidden');//.remove();//.children().addClass('property_hidden');
			}
			
			// adding data to images
			$('a#img' + photoID[ii])
				.data('date', photoDate[ii])
				.data('id', photoID[ii])
				.data('midsizedPhoto', midsizedPhotos[ii])
				.data('extendedPhoto', extendedPhotos[ii])
				.data('groupNumber', photoPropertyGroupNumber[ii])
				.data('faceData', photoPropertyFaceData[ii]);
			
			ii++;
		} // end for
		i++;
	} // end for
	
	// calling default group division of 8 hours break
	producePhotoGroups('div.break:eq(0) ~ *', 0, 28800, breakGroup, setGroupHeaders);
	adjustGroups();
	setGroupHeaders();
	
	/*
	// adding fancybox event to all images
	$('a.images').fancybox({
		'type': 'iframe',
		'width': 1100,
		'height': 900
	});
	*/

} // end function

function showError(e) {
	console.log('Network Error!!!');
}

function zoomPhotos(id, link) {
	
	var midsizedPhotos = [];
	var extendedPhotos = [];
	$('div#zoom').append('<div id="group"></div>');
	
	$('div.break:eq('+id+') ~ *').each(function(i){
		
		if ($(this).is(".break")) {
          	return false;
        }
        
		midsizedPhotos[i] = $(this).data('midsizedPhoto');
		extendedPhotos[i] = $(this).data('extendedPhoto');
		$('div#group').append('<a class="images" id="img" target="_blank" href="' + extendedPhotos[i] 
			+ '" rel="images"><img alt="" src="' + midsizedPhotos[i] + '"></a>');
	
	}); // end each
	
	/*
	$('a.images').fancybox({
		'type': 'image',
		'cyclic': true,
		'speedIn': 1,
		'speedOut': 1,
		'changeSpeed': 1,
		'overlayShow': false,
		'onClosed' : removeZoomPhotos
		});
	*/
	
	$(link).fancybox({
		'width' : 1164,
		'height': 800,
		'autoDimensions' : false,
		'overlayShow': false,
		'onClosed' : removeZoomPhotos	
	});
}

function removeZoomPhotos() {
	$('div#group').remove();
}

function producePhotoGroups(element,id,seconds,breakDiv,callback){
	
	var dates =[];
	var timeDiff = [];
	var breakTime = seconds;
	
	$(element).each(function(i){
	//$(element + ':eq('+id+') ~ *').each(function(i){
	//$('div.break:eq('+id+') ~ *').each(function(i){
		
		if ($(this).is(".break")) {
          	return false;
        }
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
	
	callback(element, id);
}

/*
function hideSinglePhotos(element, id){
	
	$(element).each(function(i){
	//$(element + ':eq('+id+') ~ *').each(function(i){
		
		if ($(this).is(".break")) {
          	return false;
        }
        
        if ($(this).is(".similar")) {
        	if ($(this).prev().prev().is(".break")) {
          		//$(this).prev().hide();
          	};
        }
        
		if ($(this).is(".similar")) {
        	if ($(this).next().next().is(".similar")) {
          		//$(this).next().hide();
          	};
        } 
		
		if ($(this).is(".similar")) {
        	if ($(this).next().next().is(".break")) {
          		//$(this).next().hide();
          	};
        } 
		 
	}); // end each
	
}

function removePhotoSimilar(element, id){
	
	$(element).each(function(i){
	//$(element + ':eq('+id+') ~ *').each(function(i){
		if ($(this).is(".break")) {
          	return false;
        }
		if ($(this).is(".similar")) {
          	$(this).remove();
        } 
		$(this).removeAttr('style');		 
	}); // end each

}
*/

function getMaxTimeDiff(id){
	
	var dates =[];
	var timeDiff = [];
	
	$('div.break:eq('+id+') ~ *').each(function(i){
		
		if ($(this).is(".break")) {
          	return false;
        }
		dates[i] = $(this).data('date');
		if (i==0) {
			timeDiff[i] = 0;
		} else {
			timeDiff[i] = dates[i] - dates[i-1];
		} 
	}); // end each
	
	return Math.max.apply(0,timeDiff);
}


function setGroupHeaders() {
	
	var name = 'Group';
	var numberOfGroups = $('div.break').size();
	var headerElements = [];

	headerElements[0] = '<span class="header"></span>';
	headerElements[1] = '<input class="header" id="savegroup" type="button" value="save"/>';
	headerElements[2] = '<input class="header" id="collectfaceinfo" type="button" value="fc"/>';
	headerElements[3] = '<input class="header" id="faces" type="button" value="f"/>';
	headerElements[4] = '<a id="testzoom" href="#group"><input class="header" id="zoomgroup" type="button" value="zoom"/></a>';
	headerElements[5] = '<input class="header" id="unhidegroup" type="button" value="+"/>';
	headerElements[6] = '<input class="header" id="hidegroup" type="button" value="-"/>';
	//headerElements[5] = '<input class="header" id="focus" type="button" value="f"/>';
	headerElements[7] = '<input class="header" id="mergedown" type="button" value="down"/>';
	headerElements[8] = '<input class="header" id="mergeup" type="button" value="up"/>';
	headerElements[9] = '<input class="header" id="breakmax" type="button" value="max"/>';
	headerElements[10] = '<input class="header" id="summary" type="button" value="sum"/>';
	headerElements[11] = '<input class="header" id="similar" type="button" value="similar"/>';
	headerElements[12] = '<input class="header" id="break" type="button" value="break"/>';
	headerElements[13] = '<input class="header" id="time" type="input" value="" size="7"/>';
	
	$('div.break').each(function(i){
		
		// removing all elements
		$(this).children().remove();
		
		// adding elements 
		$(this).append(headerElements.join(""));
		
		// setting group name with id and date + time
		var fullDateFirst = getFullDate($(this).next().data('date'));
		var fullDateLast = getFullDate($('div.break:eq('+ (i+1) +')').prev().data('date'));
		if ( i === numberOfGroups -1) {
			var fullDateLast = getFullDate($(this).nextAll('a:last').data('date'));	
		}
	
		$(this).find('span.header').text(name + ' ' + i + '  -  ' + fullDateFirst + ' ... ' + fullDateLast);
		
		// clearing value in time input
		$(this).find('input#time').val("");
		
		// adding click event to break button
		$(this).find('input#break').click(function(){
			var seconds = $(this).siblings('input#time').val();
			if (seconds>0) {
				producePhotoGroups('div.break:eq('+i+') ~ *', i, seconds, breakGroup, setGroupHeaders);
			}
		}); //end click
		
		// adding click event on max button
		$(this).find('input#breakmax').click(function(){
			var maxTimeDiff = getMaxTimeDiff(i);
			if (maxTimeDiff < 1) {
				var maxTimeDiff = 1;
			}
			var seconds = maxTimeDiff-1;
			producePhotoGroups('div.break:eq('+i+') ~ *', i, seconds, breakGroup, setGroupHeaders);
			
		}); // end click
		
		//adding click event on similar button
		$(this).find('input#similar').click(function(){
		
			var groupNumber = $('div.break:eq('+i+')').next().data('groupNumber');
			var seconds = $(this).siblings('input#time').val();
			if (seconds <= 0) {
				var seconds = 300;
			}
			var addr = '../_html/similar.html?group=' + groupNumber +'&seconds=' + seconds;
			window.open(addr);
		});
		
		//adding click event on summary button
		$(this).find('input#summary').click(function(){
			
			var groupNumber = $('div.break:eq('+i+')').next().data('groupNumber');
			var seconds = $(this).siblings('input#time').val();
			if (seconds <= 0) {
				var seconds = 0; //set to zero to produce given number of groups
			}
			var addr = '../_html/summary.html?group=' + groupNumber +'&seconds=' + seconds;
			window.open(addr);
		});
		
		// adding click event on merge up button
		$(this).find('input#mergeup').click(function(){
			if (i != 0) {
				$(this).parent().remove();
				setGroupHeaders();	
			}
		}); // end click
		
		// adding click event on merge down button
		$(this).find('input#mergedown').click(function(){
			$(this).parent().nextAll('div.break:first').remove();
			setGroupHeaders();
		}); // end click
/*		
		// adding click event on focus button
		$(this).find('input#focus').click(function(){
			focusGroup(i);
		}); // end click
*/		
		// adding click event on hide button
		$(this).find('input#hidegroup').click(function(){
			//hideGroup(i);
			hideGroupDB(i);
		}); // end click
		
		// adding click event on hide button
		$(this).find('input#unhidegroup').click(function(){
			//hideGroup(i);
			unhideGroupDB(i);
		}); // end click
		
		// adding click event on zoom button
		$(this).find('input#zoomgroup').click(function(){
			zoomPhotos(i, 'a#testzoom');
		}); // end click
		
		//adding click event on faces button
		$(this).find('input#faces').click(function(){
			var groupNumber = $('div.break:eq('+i+')').next().data('groupNumber');
			var addr = '../_html/faces.html?group=' + groupNumber;
			window.open(addr);
		});
		
		//adding click event on collect face info button
		$(this).find('input#collectfaceinfo').click(function(){
			var urlsOfImages = getGroupImagesUrls(i);
			collectFaceData(urlsOfImages);
		});
		
		// adding click event on save button
		$(this).find('input#savegroup').click(function(){
			$(this).attr('value', 'saved').attr("disabled", true);
			saveGroup(i);
		}); // end click
		
	}); // end each	
}

function getFullDate(seconds){
	
	var mseconds = 	seconds*1000;
	var date = new Date(mseconds);
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear() - 1970;
	var weekDay = date.getDay();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	if (minutes<10) {
		var minutes = '0' + minutes;
	}	
	
	var fullDate = day +'.'+ month +'.'+ year +' @' + hours +':' + minutes; 
	
	return fullDate;
};

/*
function focusGroup(id) {
	
	$('div.main div.break, div.similar, a.images').hide();
	$('div.break:eq('+id+')').show();
	$('div.break:eq('+id+') ~ *').each(function(i){
		
		if ($(this).is(".break")) {
          	return false;
        }
		$(this).show();
		 
	}); // end each
	
}
*/

function hideGroupDB(id) {
	
	var propertyName = 'hidden';
	var propertyValue = 'Y';
	
	$('div.break:eq('+id+')').hide();
	$('div.break:eq('+id+') ~ *').each(function(i){
		
		if ($(this).is(".break")) {
          	return false;
        }
        $(this).hide();
        var photoID = $(this).data('id');
		setPhotoProperty(photoID, propertyName, propertyValue);
		$(this).children().addClass('property_hidden'); 
	});
}

function unhideGroupDB(id) {
	
	var propertyName = 'hidden';
	var propertyValue = 'N';
	
	//$('div.break:eq('+id+')').hide();
	$('div.break:eq('+id+') ~ *').each(function(i){
		
		if ($(this).is(".break")) {
          	return false;
        }
        //$(this).show();
        var photoID = $(this).data('id');
		setPhotoProperty(photoID, propertyName, propertyValue);
		$(this).children().removeClass('property_hidden'); 
	});
}


/*
function hideGroup(id) {
	
	$('div.break:eq('+id+')').hide();
	$('div.break:eq('+id+') ~ *').each(function(i){
		
		if ($(this).is(".break")) {
          	return false;
        }
		$(this).hide();
		 
	});
}
*/

function saveGroup(id){
	
	var propertyName = 'groupNumber';
	var propertyValue = Math.floor(Math.random()*100000000+1);
	
	$('div.break:eq('+id+') ~ *').each(function(i){
		
		if ($(this).is(".break")) {
          	return false;
        }
		//console.log($(this).data('id'));// debuging info
		var photoID = $(this).data('id');
		setPhotoProperty(photoID, propertyName, propertyValue); 
	});
}

// adjusts groups based on 'groupNumber' property
function adjustGroups(){
	$('div.main div.break').each(function(i){
		var prev = $(this).prev().data('groupNumber');
		var next = $(this).next().data('groupNumber');
		if (prev != 'NA' || next != 'NA'){
			if (prev === next){
				$(this).remove();
			}
		}
	});
	
	$('div.main a.images').each(function(i){
		//var prev = $(this).prev().data('groupNumber');
		var curr = $(this).data('groupNumber');
		var next = $(this).next().data('groupNumber');
		
		if (curr != next){
			if (typeof next != 'undefined'){
				$(this).after(breakGroup);
			}
		}
	});
}

// collects and prepares urls for recognizeFace function
function getAllImagesUrls(){
	
	var urls = [];
	
	$('a.images').each(function(){
		urls.push($(this).data('extendedPhoto') + '?id=' + $(this).data('id'));
	});
	
	return urls;
}

// collects and prepares urls for recognizeFace function
function getImageUrl(){
	var urls = []; 
	var selectedPhoto = $('div.main img:hover');	
	
	urls.push(selectedPhoto.parent().data('extendedPhoto') + '?id=' + selectedPhoto.parent().data('id'));
	
	return urls;
}

// collects and prepares urls for recognizeFace function
function getGroupImagesUrls(id){
	
	var urls = []; 
	
	$('div.break:eq('+id+') ~ *').each(function(i){
		
		if ($(this).is(".break")) {
          	return false;
        }
        
        urls.push($(this).data('extendedPhoto') + '?id=' + $(this).data('id'));

	});
	
	return urls;
}

// collects face info for all urls in array, stores it in photo property in DB, updates data property in html
function collectFaceData(arrayOfUrls){
	
	var images = arrayOfUrls;
	var numberOfImages = images.length;
	
	// runs recognize function once per 30 pictures due to limitations of face.com API
	while (numberOfImages > 0) {
		recognizeFace(images.slice(0,30).toString(), saveFaceData);
		images.splice(0,30);
		numberOfImages = images.length;
	}
	
	// tests saveFaceData only on a few pictures
	//console.log(images.slice(10,12).toString());
	//recognizeFace(images.slice(10,12).toString(), saveFaceData);
	
}