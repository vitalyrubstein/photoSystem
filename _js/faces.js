function showPhotosByGroup(json) {

	var i = 0;
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
		var photoPropertyFaceData = [];
		
		for(var propertyName in json[i]){
			
			photoID[ii] = json[i][ii]['id']; // getting ID of image
			avatarPhotos[ii] = photoURL + json[i][ii]['images']['avatar']; //.wap_w .avatar .profile_h
			midsizedPhotos[ii] = photoURL + json[i][ii]['images']['profile_h'];//.wap_w;
			extendedPhotos[ii] = photoURL + json[i][ii]['images']['extended']// + '?id=' + photoID[ii];  //.extended .standard
			photoDate[ii] = json[i][ii]['date']; // getting time of image
			
			
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
					.data('groupNumber', photoPropertyGroupNumber[ii])
					.data('faceData', photoPropertyFaceData[ii]);
					
			}
			ii++;
		} // end for
		i++;
	} // end for
	$('a.images').hide();
	console.log("Done building");
} // end function

// removes images without faces
function showImagesWithFacesOnly(minNumberOfFaces, minFaceConfidence){
	
	var images = $('a.images');
	
	$.each(images,function(i,v){
		
		var c = 0; // counter of faces with minFaceConfidnce
		var numberOfFaces = getFaceProperty(this,'numberOfFaces');
		
		for (ii=0; ii<numberOfFaces; ii++){
			var faceConfidence = getFaceProperty(this,'face_' + ii + '_confidence');
			if (faceConfidence > minFaceConfidence) {
				c++
			}
		}
		
		if (c < minNumberOfFaces) {
			$(this).remove();
		}
	
	});
}

// gets a required face property stored in local data for a.images
function getFaceProperty(target, facePropertyName){
	
	var faceData = $(target).data('faceData');
	var faceDataSplit = faceData.split(',');
	var output = faceDataSplit[faceDataSplit.lastIndexOf(facePropertyName) +1];
	
	return output;
}

// creates a list of all faces with all properties
function getListOfFaces(){
	
	var images = $('a.images');
	var listOfFaces = [];
	
	
	$.each(images,function(i,v){
		
		// reads photo info
		var photoID = $(this).data('id');
		var midsizedPhoto = $(this).data('midsizedPhoto');
		var extendedPhoto = $(this).data('extendedPhoto');
		// reads all faceData info
		var faceData = $(this).data('faceData');
		// splits one string into an array of strings
		var faceDataSplit = faceData.split(',');
		// reads the number of faces
		var numberOfFaces = faceDataSplit[faceDataSplit.lastIndexOf('numberOfFaces') +1];
		
		if (numberOfFaces > 0) {
			for (ii=0; ii<numberOfFaces; ii++){
				var faceInfo = {};
				// collects face info
				faceInfo['ID'] = ii;
				faceInfo['photoID'] = photoID;
				faceInfo['midsizedPhoto'] = midsizedPhoto;
				faceInfo['extendedPhoto'] = extendedPhoto;
				faceInfo['tid'] = (faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_tid') +1]);
				faceInfo['confidence'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_confidence') +1]);
				faceInfo['recognizable'] = (faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_recognizable') +1]);
				faceInfo['threshold'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_threshold') +1]);
				faceInfo['yaw'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_yaw') +1]);
				faceInfo['roll'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_roll') +1]);
				faceInfo['pitch'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_pitch') +1]);
				faceInfo['width'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_width') +1]);
				faceInfo['height'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_height') +1]);
				faceInfo['centerX'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_center_x') +1]);
				faceInfo['centerY'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_center_y') +1]);
				faceInfo['numberOfUids'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_numberOfUids') +1]);
				
				if (faceInfo['numberOfUIDS'] > 0) {
					faceInfo['topUid'] = (faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_uid_0') +1]);
					faceInfo['topUidConfidence'] = parseFloat(faceDataSplit[faceDataSplit.lastIndexOf('face_' + ii + '_uid_confidence_0') +1]);
				} else {
					faceInfo['topUid'] = 'NA';
					faceInfo['topUidConfidence'] = 0;
				}
				
				// stores face info to an array
				listOfFaces.push(faceInfo);				
			}
		}
	});
	return listOfFaces; // an array of objects
}

/*
["numberOfFaces", "2", "face_0_tid", "TEMP_F@15a09d0640a39220...64433a2_62.94_52.13_1_1", "face_0_recognizable", "false", "face_0_threshold", "", 
"face_0_yaw", "13.99", "face_0_roll", "5.37", "face_0_pitch", "-14.57", "face_0_yaw", "13.99", "face_0_confidence", "64", "face_0_numberOfUids", "0",
"face_0_width", "3.03", "face_0_height", "4.55", "face_0_center_x", "62.94", "face_0_center_y", "52.13", 
"face_1_tid", "TEMP_F@15a09d0640a39220...64433a2_77.15_52.49_1_1", "face_1_recognizable", "false", "face_1_threshold", "", "face_1_yaw", 
"-46.84", "face_1_roll", "-6", "face_1_pitch", "1.12", "face_1_yaw", "-46.84", "face_1_confidence", "67", "face_1_numberOfUids", "0", 
"face_1_width", "2.73", "face_1_height", "4.11", "face_1_center_x", "77.15", "face_1_center_y", "52.49"]
faces.js (line 96)

*/

function sortFaces(){
	
	var listOfFaces = getListOfFaces();
	var newListOfFaces = [];
	
	$.each(listOfFaces, function(i,v){
		
		if (v['confidence'] > 80 && v['recognizable'] === 'true'){
			newListOfFaces.push(v);
		}
	
	});
	
	return newListOfFaces.sort(compareByIndex);
	
}

function compareByIndex(a,b) {
  
	var yawA = Math.abs(a['yaw']);
	var rollA = Math.abs(a['roll']);
	var pitchA = Math.abs(a['pitch']);
	var indexA = parseInt(yawA + rollA + pitchA);

	var yawB = Math.abs(b['yaw']);
	var rollB = Math.abs(b['roll']);
	var pitchB = Math.abs(b['pitch']);
	var indexB = parseInt(yawB + rollB + pitchB);

	var widthA = a['width'];
	var heightA = a['height'];
	var indexA2 = widthA * heightA;

	var widthB = b['width'];
	var heightB = b['height'];
	var indexB2 = widthB * heightB;
	
	// adds second sorting by face area from larger to smaller
	if (indexA === indexB) {
		if (indexA2 > indexB2){
			indexA = indexA - 1;
		} else {
			indexB = indexB - 1;
		}
	}
	
	if (indexA < indexB){
		return -1;	
	}
     
  	if (indexA > indexB) {
	return 1;
	}
    
  	return 0;
}

function compareByIndex2(a,b) {
  
	var widthA = a['width'];
	var heightA = a['height'];
	var indexA = widthA * heightA;

	var widthB = b['width'];
	var heightB = b['height'];
	var indexB = widthB * heightB;
	
	if (indexA > indexB){
		return -1;	
	}
     
  	if (indexA < indexB) {
	return 1;
	}
    
  	return 0;
}




/*
function compareByIndex(a,b) {
  
	if (a['confidence'] > b['confidence']){
		return -1;	
	}
     
  	if (a['confidence'] < b['confidence']) {
	return 1;
	}
    
  	return 0;
}
*/


function showBestFaces(){
	
	var faceDetectionURL = '../_html/faceTrain.html?url=';
	var listOfFaces = sortFaces();
	
	$('div.main').after('<div class="output"></div>');
	
	$.each(listOfFaces, function(i,v){
		//console.log(v);
		
		var yawA = Math.abs(v['yaw']);
		var rollA = Math.abs(v['roll']);
		var pitchA = Math.abs(v['pitch']);
		var indexA = parseInt(yawA + rollA + pitchA);

		var widthA = v['width'];
		var heightA = v['height'];
		var indexA2 = widthA * heightA;		
		
		console.log('A: ' + indexA + ' A2: ' + indexA2);
		
		
		$('div.output').append(
			'<div class="outputimages"><a target="_blank" href="' + faceDetectionURL + v['extendedPhoto'] + '"><img class="output" src="' + v['midsizedPhoto'] + '"></a><span class="facemarks"></span></div>'
			);
		
		var img = $('img.output:last');
		var imgWidth = img.width();
		var imgHeight = img.height();
		
		var faceCenterX = v['centerX'];
		var faceCenterY = v['centerY'];
		var faceWidth = v['width'];
		var faceHeight = v['height'];
		
		var markCenterFaceX = imgWidth * faceCenterX / 100;
		var markCenterFaceY = imgHeight * faceCenterY / 100;
		
		// calculating Width and Height of face mark
		var markFaceWidth = imgWidth * faceWidth / 100; // face width
		var markFaceHeight = imgHeight * faceHeight / 100; // face height
		
		// calculating X and Y for left top corner of face mark 	
		var markFaceX = markCenterFaceX - markFaceWidth/2; // left position of the mark
		var markFaceY = markCenterFaceY - markFaceHeight/2; // top position of the mark
		
		$('span.facemarks:last')
			.css('top', markFaceY)
			.css('left', markFaceX)
			.css('width', markFaceWidth)
			.css('height', markFaceHeight)
			
		//console.log(markCenterFaceX);
		
	});
}


/*
function compare(a,b) {
  if (a.last_nom < b.last_nom)
     return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}

objs.sort(compare);
*/

/*
numberOfFaces,3,face_0_tid,TEMP_F@4f1bbe28210420975207a785eaf7a304_0a177b4e57080f4617080a51c64433a2_18.21_49.49_1_1,face_0_recognizable,true,
face_0_threshold,43,face_0_yaw,13.67,face_0_roll,3.03,face_0_pitch,-13.01,face_0_yaw,13.67,face_0_confidence,84,face_0_numberOfUids,2,
face_0_width,15.53,face_0_height,23.31,face_0_center_x,18.21,face_0_center_y,49.49,face_0_uid_0,alex@r76,face_0_uid_confidence_0,39,
face_0_uid_1,erik@r76,face_0_uid_confidence_1,32,
face_1_tid,TEMP_F@4f1bbe28210420975207a785eaf7a304_0a177b4e57080f4617080a51c64433a2_46.09_36.51_1_1,face_1_recognizable,true,
face_1_threshold,47,face_1_yaw,-20.81,face_1_roll,14.57,face_1_pitch,-0.33,face_1_yaw,-20.81,face_1_confidence,90,face_1_numberOfUids,3,
face_1_width,14.26,face_1_height,21.41,face_1_center_x,46.09,face_1_center_y,36.51,face_1_uid_0,christa@r76,face_1_uid_confidence_0,66,
face_1_uid_1,stranger@r76,face_1_uid_confidence_1,27,face_1_uid_2,vitaly@r76,face_1_uid_confidence_2,20,
face_2_tid,TEMP_F@4f1bbe28210420975207a785eaf7a304_0a177b4e57080f4617080a51c64433a2_67.43_52.71_1_1,
face_2_recognizable,false,face_2_threshold,,face_2_yaw,13.78,face_2_roll,-2.6,face_2_pitch,-13.24,face_2_yaw,13.78,face_2_confidence,78,
face_2_numberOfUids,0,face_2_width,18.65,face_2_height,28.01,face_2_center_x,67.43,face_2_center_y,52.71
home.html (line 91)
*/






