function showPhotosGroup(json) {

	var i=0;
	var c=0;
	var photoURL ='http://176.34.237.117/riak/photos/';
	var faceDetectionURL = 'file:///Users/ruby/Documents/AptanaWorkspace/BLAST/pms2/_html/faceTrain.html?url=';
	
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
				$('div.main').append('<a class="images" id="img' + c + '" target="_blank" href="' + faceDetectionURL + extendedPhotos[ii] 
				+ '" rel="images"><img alt="" src="' + midsizedPhotos[ii] + '"></a>');
			
				// adding data to images
				$('a#img' + c).data('date', photoDate[ii]);
				$('a#img' + c).data('id', photoID[ii]);
				$('a#img' + c).data('midsizedPhoto', midsizedPhotos[ii]);
				$('a#img' + c).data('extendedPhoto', extendedPhotos[ii]);
				$('a#img' + c).data('groupNumber', photoPropertyGroupNumber[ii]);
			}
			
			ii++;
			c++;
		} // end for
		i++;
	} // end for
	
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
	
}