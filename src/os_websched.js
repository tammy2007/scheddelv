var strCaItem = 'Copy / Add new';
var arrSelf = location.href.split('/');
var strSelf = arrSelf[arrSelf.length-1];
if(strSelf.indexOf('?id=') == 0 || strSelf.indexOf('#') == 0 || strSelf == ''){
	strSelf = 'index.html';
}

var strNvHide = 'Hide all';
var strNvHideCls = 'nv_hide';
var strNvShow = 'Show all';
var strNvShowCls = 'nv_show';
var intSlideSpeed = 200;

//var arrStrSort = {'asc': 'desc', 'desc': 'asc'};
var intHtDiv = 618;

var objStkyHd = $('#stickyhead');

var arrPairBranch = {
	  '6': '13'	//for FXHK
	, '13': '6'
	, '7': '15'	//for FXTH
	, '15': '7'
	, '8': '16'	//for FXV
	, '16': '8'
};

$(document).ready(function(){
	//Display Preferences
	$('.allclear').css({'display': 'inline-block'});

	//for List page
	if(strSelf.indexOf('index.html') == 0){
		//Hide/Show toggle button in Navi
		$('.'+strNvShowCls).on('click', function(e){
			e.preventDefault();
		});
		$('.'+strNvShowCls).on('click', function(){
			$(this).toggleClass(strNvHideCls);

			var strCls = $(this).attr('class');
			if(strCls.indexOf(strNvHideCls) > -1){
				//$('[class^=ln_det]').find('td div').slideDown(intSlideSpeed);
				$('[class^=ln_det]').find('td div').css({'display': 'block'});
				$('[class^=ln_det]').css({'display': 'table-row'});
				$('.'+strNvShowCls).text(strNvHide);

				//Store heigth of div in Remark/Log cell
				var arrIntLogH = storeDivHt();

				//Set height of Remark/Log cell
				$('td.rw_log').each(function(index, element){
					var intHt = $(element).innerHeight() - 14;
					//console.log(intHt);
					if(arrIntLogH[index] > intHtDiv || arrIntLogH[index] > intHt){
						$(element).find('div').css({'min-height': intHt});
						$(element).parent().find('.rw_remark div').css({'min-height': intHt});
					}
				});

			}else{
				//$('[class^=ln_det]').find('td div').slideUp(intSlideSpeed);
				$('[class^=ln_det]').css({'display': 'none'});
				$('[class^=ln_det]').find('td div').css({'display': 'none'});
				$('.'+strNvShowCls).text(strNvShow);
			}
		});

		//Display Preferences
		if(arrSelf[arrSelf.length-1].indexOf('index.html?id=') == 0 || arrSelf[arrSelf.length-1].indexOf('?id=') == 0){
			$('[id^=drwr_]').css({'display': 'none'});
		}else{
			$('[class^=ln_det]').css({'display': 'none'});
			$('[class^=ln_det]').find('td div').css({'display': 'none'});
			$('.'+strNvShowCls).css({'display': 'list-item'});
			$('[class^=th_] span').addClass('sort');
		}
		$('[class^=toggle]').css({'cursor': 'pointer'});

		//Open/Close detail line
		opclDetailLine();

		//Sort List
		sortList();

		//All clear button
		$('.allclear').on('click', function(){
			clearForm(this.form);
		});

		//"All published only" should be checked only one
		$('[id^=rdmc_stts]').change(function(){
			if($(this).val() != 'all'){
				$('.all_p_only input').prop('checked', false);
			}else{
				var bolAllPub = $('.all_p_only input').prop('checked');
				$('[id^=rdmc_stts]').each(function(index, element){
					$(element).prop('checked', false);
				});

				//console.log(bolAllPub);
				$('.all_p_only input').prop('checked', bolAllPub);
			}
		});
		/* When select box
			$('#rdmc_stts').change(function(){
			var arrVal = $(this).val();
			if(arrVal[0] != 'all'){
				$('.all_p_only').prop('selected', false);
				$('.all_p_only').removeClass('sel');
			}
		});*/

		//Sticking table header
		$(window).scroll(function(){
			stickyHeader();
		});
		transStkyHd();

	//for Add new page
	}else if(strSelf == 'addnew.html'){
		//Display Preferences
		$('.err_new_select').css({'display': 'inline'});
		$('#ca_itemstr').text(strCaItem);
		$('.cdnm_sl_box').css({'display': 'inline-block'});
		$('#cd_nm_str').hide();

		//All clear button
		$('.allclear').on('click', function(){
			clearForminDiv();
			chngBKC();
		});

		//Code name at Add form
		$('#cd_nm').change(function() {
			chngCdNm(this, strCaItem);
		});
		if($('#cd_nm').val() == 'new'){
			//console.log($('#cd_nm').val());
			$('#cd_nm_str').show();
		}

		//Copy / Lookup / Options
		funcHedearIcons();

		//Toggle Check box
		chngBKC();
		toggleCkbx();

		//Check date in pair branch
		chckDate();

	//for Edit page
	}else if(strSelf.indexOf('edit.html') == 0){
		//All clear button
		$('.allclear').on('click', function(){
			clearForminDiv();
			chngBKC();
		});

		//Copy / Lookup / Options
		funcHedearIcons();

		//Toggle Check box
		chngBKC();
		toggleCkbx();

		//Check date in pair branch
		chckDate();

	}

	//Icon for go to Page top
	var objPagetop = $('#page_top');
	objPagetop.hide();
	$(window).scroll(function(){
		if($(this).scrollTop() > 100) {
			objPagetop.fadeIn();
		}else{
			objPagetop.fadeOut();
		}
	});
	objPagetop.click(function () {
		$('body, html').animate({
			scrollTop: 0
		}, 500);
		return false;
	});

	//Decorate select menu
	$('select').children('option').each(function(index, element){
		if($(element).val() !== '--') $(element).addClass('ckbft');
	});
	$('select').change(function(){
		var objSelect = $(this);
		var arrVal = objSelect.val();
		objSelect.children('option').each(function(index, element){
			if($.inArray($(element).val(), arrVal) == -1){
				$(element).removeClass('sel');
			}else{
				$(element).addClass('sel');
			}
		});
	});

	//Reset button
	$('input:reset').on('click', function(){
		event.preventDefault();
		$(this.form).get(0).reset();
		chngBKC();
	});

});


$(document).ajaxStop(function(){
	//Display Preferences
	$('.allclear').css({'display': 'inline-block'});

	//for List page
	if(strSelf.indexOf('index.html') == 0){
		//Display Preferences
		$('[class^=ln_det]').css({'display': 'none'});
		$('[class^=ln_det]').find('td div').css({'display': 'none'});
		$('[class^=toggle]').css({'cursor': 'pointer'});
		$('.'+strNvShowCls).css({'display': 'list-item'});
		$('[class^=th_] span').addClass('sort');

		//Open/Close detail line
		opclDetailLine();

		//Sort List
		sortList();

		//All clear button
		$('.allclear').on('click', function(){
			clearForm(this.form);
		});

	//for Add new page
	}else if(strSelf == 'addnew.html'){
		//Display Preferences
		$('.cdnm_sl_box').css({'display': 'inline-block'});

		//All clear button
		$('.allclear').on('click', function(){
			clearForminDiv();
			chngBKC();
		});

		//Code name at Add form
		$('#cd_nm').change(function() {
			chngCdNm(this, strCaItem);
		});

		//Copy / Lookup / Options
		funcHedearIcons();

		//Toggle Check box
		chngBKC();
		toggleCkbx();

		//Check date in pair branch
		chckDate();

	//for Edit page
	}else if(strSelf.indexOf('edit.html') == 0){
		//All clear button
		$('.allclear').on('click', function(){
			clearForminDiv();
			chngBKC();
		});

		//Copy / Lookup / Options
		funcHedearIcons();

		//Toggle Check box
		chngBKC();
		toggleCkbx();

		//Check date in pair branch
		chckDate();
	}

	//Reset button
	$('input:reset').on('click', function(){
		event.preventDefault();
		$(this.form).get(0).reset();
		chngBKC();
	});
});


$(window).on('resize', function(){
	//for List page
	if(strSelf.indexOf('index.html') == 0){
		//var start = performance.now();
		//Store heigth of div in Remark/Log cell
		var arrIntLogH = storeDivHt();

		//Store open/close boolean to a array, and then open the datail rows once
		var arrBolOpCl = [];
		$('[class^=toggle]').each(function(index, element){
			var intRow = $(element).attr('class').replace('toggle', '');
			var objTr = $(element).next('tr');
			arrBolOpCl[intRow] = objTr.css('display');
			if(arrBolOpCl[intRow]){
				var intHt = objTr.find('td.rw_log').innerHeight() - 14;	/* padding: (7px * 2) */
				if(arrIntLogH[index] > intHtDiv || arrIntLogH[index] > intHt){
					objTr.find('.rw_log div').css({'min-height': intHt});
					objTr.find('.rw_remark div').css({'min-height': intHt});
				}
			}
		});

		stickyHeader();

		//var end = performance.now();
		//console.log((end - start));
	}
});



function chckDate(){
	var strVal;
	var strID;
	var strBranchNum;
	var strMes = 'Not match another date for this branch.\nDo you want to set the same date?';
	var strName = 'reldate';
	var strNameOpt = 'reldate_pre';

	//Compare the pair branch relase date
	$('[id^='+strName+']').change(function(){
		strVal = $(this).val();
		strID = $(this).attr('id');
		strBranchNum = strID.replace(strName, '')
		//console.log(strBranchNum);
	});
	$('[id^='+strName+']').focusout(function(){
		//When the date is TBD, set the relating radio button
		if(strVal == '9999-12-31'){
			$('#'+strBranchNum+'_'+strNameOpt+'_tbd').prop('checked', true);
			$('.'+strBranchNum+'_reldate_date_opt_box').css({'display': 'block'});
		}else{
			$('#'+strBranchNum+'_'+strNameOpt+'_td').prop('checked', true);
		}

		//When the pair branch exists
		var strPair = arrPairBranch[strBranchNum];
		if(strPair !== undefined){
			var objPair = $('#'+strName+strPair);
			if(objPair.val() !== ''){
				if(strVal !== objPair.val()){
					var bolRes = confirm(strMes);
					if(bolRes){
						objPair.val(strVal);
						if(strVal == '9999-12-31'){
							$('#'+strPair+'_'+strNameOpt+'_tbd').prop('checked', true);
							$('.'+strPair+'_reldate_date_opt_box').css({'display': 'block'});
						}else{
							$('#'+strPair+'_'+strNameOpt+'_td').prop('checked', true);
						}
					}
				}
			}
		}
	});

	//Compare the pair branch relase date options
	$('[id*='+strNameOpt+']').change(function(){
		strVal = $(this).val();
		strID = $(this).attr('id');
		var arrID = strID.split('_');
		strBranchNum = arrID[0];

		//When the option is selected, set the relating input box
		getDatebyOption(strVal, '#'+strName+strBranchNum);
		if(strVal !== 'td') $('.'+strBranchNum+'_reldate_date_opt_box').css({'display': 'block'});

		//When the pair branch exists
		var strPair = arrPairBranch[strBranchNum];
		if(strPair !== undefined){
			//When the value in the input box of the pair branch reldate is set
			if($('#'+strName+strPair).val() !== ''){
				var objPairOpt = $('[id^='+strPair+'_'+strNameOpt+']');
				objPairOpt.each(function(index, element){
					if($(element).prop('checked')){
						if(strVal !== $(element).val()){
							var bolRes = confirm(strMes);
							if(bolRes){
								$('#'+strPair+'_'+strNameOpt+'_'+strVal).prop('checked', true);
								$('#'+strName+strPair).val($('#'+strName+strBranchNum).val());
								getDatebyOption(strVal, '#'+strName+strPair);
								if(strVal !== 'td') $('.'+strPair+'_reldate_date_opt_box').css({'display': 'block'});
							}
						}
					}
				});
			}
		}
	});
}

function getDatebyOption(strVal, strDateID){
	var arrDateOpt = {
		  'tbd': '9999-12-31'
		, 'ear': '01'
		, 'mid': '10'
		, 'lat': '20'
	};

	if(strVal == 'td'){
		return false;
	}else if(strVal == 'tbd'){
		$(strDateID).val(arrDateOpt[strVal]);
		return true;
	}

	if($(strDateID).val() === '') return false;
	var arrDate = $(strDateID).val().split('-');
	if(arrDate.length === 1) return false;
	var strY = arrDate[0];
	var strM = arrDate[1];
	//console.log(strY, strM);

	$(strDateID).val(strY+'-'+strM+'-'+arrDateOpt[strVal]);
}


function transStkyHd(){
	$('#drwr_cl').on('click', function(){
		if(objStkyHd.length > 0){
			if($('#drwr_chk').prop('checked')){
				objStkyHd.css({'transform': 'none', '-webkit-transform': 'none'});
				var intLeft = objStkyHd.css('left').replace('px', '');
				setTimeout(function(){
					if(intLeft > $('#list').offset().left){
						objStkyHd.offset({left: intLeft - 300});
					}
				}, 300);

			}else{
				objStkyHd.css({'transform': 'translateX(300px)', '-webkit-transform': 'translateX(300px)'});
			}
		}

	});
}

function stickyHeader(){
	var objTbl = $('#list');
	var objThead = objTbl.children('thead');
	var objOffsetTbl = objTbl.offset();

	//When '#stickyhead' exist
	if(objStkyHd.length > 0){
		objStkyHd.remove();
	}

	/*if(
		    objOffsetTbl.top + 29 + objTbl.height() < $(window).scrollTop()
		 || objOffsetTbl.top + 29 > $(window).scrollTop()
	){
	}else */
	if(objOffsetTbl.top + 29 < $(window).scrollTop()){
		//When  '#stickyhead' not exits
		var objTemp= objThead.clone(true);
		//objTemp.appendTo('#resultlist');
		$('#resultlist').after(objTemp);
		objTemp.wrap('<table id="stickyhead"></table>');
		objStkyHd = $('#stickyhead');
		$('#stickyhead .trinfo').remove();

		var arrIntTheadTHW = [];
		objThead.find('tr').each(function(index, ele){
			arrIntTheadTHW[index-1] = [];
			$(ele).find('th').each(function(index2, ele2){
				arrIntTheadTHW[index-1][index2] = $(ele2).innerWidth();
			});
		});
		objStkyHd.find('tr').each(function(index, ele){
			$(ele).find('th').each(function(index2, ele2){
				$(ele2).innerWidth(arrIntTheadTHW[index][index2]);
				$(ele2).css({'min-width': arrIntTheadTHW[index][index2]-14});
			});
		});

		var intAdj = 0;
		var strUA = chkUA();
		if(strUA == 'FireFox'){
			intAdj = 1;
		}else if(strUA == 'IE' || strUA == 'Safari'){
			intAdj = 0.5;
		}
		objStkyHd.offset({left: objOffsetTbl.left - intAdj });
	}
}


function storeDivHt(){
	var arrIntLogH = [];
	$('.rw_remark div').css({'min-height': '100%'});
	$('.rw_log div').css({'min-height': '100%'});
	//console.clear();
	$('.rw_remark div').each(function(index, element){
		var intRemarkH = $(element).innerHeight();
		var intLogH = $('.rw_log div').eq(index).innerHeight();
		if(intRemarkH >= intLogH){
			arrIntLogH[index] = intRemarkH;
		}else{
			arrIntLogH[index] = intLogH;
		}
	});
	$('.rw_log div').css({'min-height': intHtDiv});
	$('.rw_remark div').css({'min-height': intHtDiv});

	return arrIntLogH;
}


function sortList(){
	$('.lead').css({'display': 'table-row'});
	$('.sort_info').css({'display': 'inline'});

	$('.sort').on('click', function(){
		var strCls = '';
		if($(this).attr('class').indexOf('asc') > -1){
			//console.log($(this).attr('class'));
			strCls = 'asc';
		}else{
			strCls = 'desc';
		}

		var strThCls = $(this).parent().prop('class').replace('th_', '');
		getString({'mod': 'sort', 'trg': strThCls, 'val': strCls}, '#resultlist')
		$('.'+strNvShowCls).text(strNvShow);
		$('.'+strNvShowCls).removeClass(strNvHideCls);
	});

	stickyHeader();
}


function funcHedearIcons(){
	//Display Preferences
	$('.cp_ico').css({'display': 'inline'});
	$('.calc_ico').css({'display': 'inline'});
	$('.lookup_ico').css({'display': 'inline'});
	$('.show_opt_ico').css({'display': 'inline'});
	$('#pull_form').css({'display': 'none', 'position': 'absolute', 'top': '760px', 'left': '0px'});
	$('#pull_form .close_ico').css({'display': 'inline'});
	$('#add_form [class*="date_opt_box"]').css({'display': 'none'});
	$('.lead').css({'display': 'table-row'});

	$('.cp_ico').on('click', function(){
		var strCLS = $(this).attr('class');
		var strTarg = strCLS.replace('cp_ico ', '');
		var intCnt = 0;
		var strID = '';

		$('[id^='+strTarg+']').each(function(index, element){
			intCnt++;
			if(intCnt == 1){
				strID = $(element).attr('id');
			}else{
				var strVal = $('#'+strID).val();
				var strTemp = $(element).attr('name').replace(']', '');
				var arrTemp = strTemp.split('[');
				//console.log(arrTemp[1]);
				if($('#trgt'+arrTemp[1]).prop('checked')){
					if($(element).val() == '') $(element).val(strVal);
				}
			}
		});
	});

	//Calcuration the delivery dates from the relase dates
	$('.calc_ico').on('click', function(){
		var arrReldates = [];
		var strRelName = 'reldate';
		var strDelvName = 'delivdate';
		$('[id^='+strRelName+']').each(function(index, element){
			var strVal = $(element).val();
			if(strVal === '') return true;

			var intID = $(element).attr('id').replace(strRelName, '');
			var strIDDeliv = strDelvName+intID;
			var dayVal = new Date(strVal);
			//console.log(intID, strVal);

			if(intID <= 10){
				arrReldates.push(dayVal);
			}else{
				if($('#'+strIDDeliv).val() !== '') return true;
				if(strVal == '9999-12-31'){
					$('#'+strIDDeliv).val(strVal);
				}else{
					$('#'+strIDDeliv).val(calcDate(dayVal, -14));
				}
			}
		});

		if(arrReldates.length && $('#'+strDelvName+'1').val() === ''){
			var dayMin = new Date(Math.min.apply(null, arrReldates));
			$('#'+strDelvName+'1').val(calcDate(dayMin, -14));
		}
	});

	//Show and hide the pull-in form
	$('.lookup_ico').on('click', function(){
		$('#pull_form').toggleClass('show_parts');
	});
	$('#pull_form .close_ico').on('click', function(){
		$('#pull_form').toggleClass('show_parts');
	});

	//for Release date options
	$('[id*=reldate_pre]').each(function(index, element){
		var strID = $(element).attr('id');
		if(strID.slice(-3) !== '_td' && $(element).prop('checked')){
			//console.log(strID);
			var arrID = strID.split('_');
			$('.'+arrID[0]+'_reldate_date_opt_box').css({'display': 'block'});
		}
	});
	$('.show_opt_ico').on('click', function(){
		$('[class*=reldate_date_opt_box]').toggleClass('show_parts');
	});

	//Keep the values of the new/edit form just before submmit the form to pull in from PLCS
	$('#product_from_lcs').change(function(){
		$('#add_form input, textarea, select').each(function(index, element){
			if($(element).attr('id') === undefined) return true;
			if($(element).attr('id').indexOf('trgt') != -1) return true;
			if($(element).attr('id').indexOf('reldate') != -1) return true;
			if($(element).attr('id') === 'product_from_lcs') return true;
	
			//Store
			window.sessionStorage.setItem([$(element).attr('id')], [$(element).val()]);
		});
	});

	//Set the SESSION values
	$('#add_form input, textarea, select').each(function(index, element){
		if($(element).attr('id') === undefined) return true;
		if($(element).attr('id').indexOf('reldate') != -1) return true;
		if($(element).attr('id').indexOf('trgt') != -1) return true;
		if($(element).attr('id') === 'product_from_lcs') return true;

		var strSESSdata = window.sessionStorage.getItem([$(element).attr('id')]);
		if(strSESSdata != null){
			$(element).val(strSESSdata);
			if($(element).attr('id') === 'cd_nm' && strSESSdata === 'new'){
				$('#cd_nm_str').show();
			}
		}
	});

	$('#add_form input:submit').on('click', function(){
		window.sessionStorage.clear();
	});

}	//End of funcHedearIcons

function calcDate(dayVal, intAdjust){
	dayVal.setDate(dayVal.getDate() + intAdjust);
	var y = dayVal.getFullYear();
	var m = ("00" + (dayVal.getMonth()+1)).slice(-2);
	var d = ("00" + dayVal.getDate()).slice(-2);
	return y+'-'+m+'-'+d;
}

function chngCdNm(objTgt, strCaItem){
	var strSelID = $(objTgt).val();
	if(strSelID == 'new'){
		$('#cd_nm_str').show();
		clearForminDiv();
		$('#cd_nm').val(strSelID);
	}else if(strSelID == '--'){
		$('#cd_nm_str').hide();
		clearForminDiv();
		$('#ca_itemstr').text(strCaItem);
	}else{
		$('#cd_nm_str').hide();
		var arrPost = {'mod': 'prod_copy', 'val': strSelID};
		getString(arrPost, '#container_form');
	}
	window.sessionStorage.clear();
}


function toggleCkbx(){
	$('#tgl_trgt').on('click', function(){
		var bolChk = $(this).prop('checked');
		$('[id^=trgt]').each(function(index, element){
			$(element).prop('checked', bolChk);
		});
		chngBKC();
	});

	$('[id^=trgt]').on('click', function(){
		var intBolChk = 0;
		$('[id^=trgt]').each(function(index, element){
			if($(element).prop('checked') == true){
				intBolChk++;
			}
		});
		if($('[id^=trgt]').length == intBolChk){
			$('#tgl_trgt').prop('checked', true);
		}else{
			$('#tgl_trgt').prop('checked', false);
		}
		chngBKC();
	});
}

function opclDetailLine(){
	$('[class^=toggle]').on('click', function(){
		var intCnt = 0;
		var strCLS = $(this).attr('class');
		var intClickRow = strCLS.replace('toggle', '');
		var objDtlTr = $('.ln_det'+intClickRow);

		if(objDtlTr.css('display') == 'none'){
			objDtlTr.find('td div').slideDown(intSlideSpeed);
			objDtlTr.find('td div').css({'display': 'block'});
			objDtlTr.slideDown(intSlideSpeed, objDtlTr.css({'display': 'table-row'}));

			//Set height of Remark/Log cell
			var objTDremark = $(this).next('tr').find('td.rw_log');
			var intHt = objTDremark.innerHeight() - 14;
			//console.log(intHt);
			objTDremark.find('div').css({'min-height': intHt});
			objTDremark.parent().find('.rw_remark div').css({'min-height': intHt});

			stickyHeader();

		}else{
			intCnt--;
			objDtlTr.find('td div').slideUp(intSlideSpeed);
			setTimeout(function() {
				objDtlTr.hide();
				stickyHeader();
			}, intSlideSpeed);
		}

		$('[class^=toggle]').each(function(index, element){
			strCls = $(element).attr('class');
			var intRow = strCls.replace('toggle', '');
			if($('.ln_det'+intRow).css('display') == 'table-row'){
				intCnt++;
			}
		});
		if(intCnt == 0){
			$('.'+strNvHideCls).text(strNvShow);
			$('.'+strNvHideCls).prop('class', strNvShowCls);
		}else if(intCnt === $('[class^=toggle]').length){
			$('.'+strNvShowCls).text(strNvHide);
			$('.'+strNvShowCls).prop('class', strNvShowCls+' '+strNvHideCls);
		}

	});
}

function chngBKC(){
	//console.clear();
	var objTargTr = $('#div_form').find('tr');
	var strCBright = '#F4F4F4';
	var strCDark = '#E2E2E2';

	var arrBolChk = [];
	var arrIntDark = [];
	var arrIntRowSpan = [];
	var intLineRS = 0;

	objTargTr.each(function(index, element){
		if($(element).children(0).prop('tagName').toUpperCase() == 'TD'){
			arrBolChk[index] = $('#trgt'+(index-1)).prop('checked');
			arrIntRowSpan[index] = $(element).find('td:eq(1)').attr('rowspan');
			if($(element).find('[id^=delivdate]').length){
				intLineRS = index;
				arrIntDark['line'+intLineRS] = 0;
			}
			if(arrBolChk[index] === false){
				arrIntDark['line'+intLineRS]++;
			}
		}
	});
	//console.log(arrIntDark);
	//console.log(arrIntRowSpan);

	objTargTr.each(function(index, element){
		if($(element).children(0).prop('tagName').toUpperCase() == 'TH') return true;

		var objTD = $(element).find('td');
		objTD.css({'background-color': strCBright});
		if(arrBolChk[index]) return true;

		//console.log(index, arrBolChk[index], arrIntDark['line'+index], arrIntRowSpan[index]);
		if(arrIntRowSpan[index] !== undefined){
			if(arrIntDark['line'+index] === parseInt(arrIntRowSpan[index],10)){
				objTD.css({'background-color': strCDark});
			}else{
				if(arrIntDark['line'+index] !== undefined){
					objTD.css({'background-color': strCDark});
				}
				objTD.each(function(index, element2){
					if($(element2).attr('rowspan') !== undefined){
						$(element2).css({'background-color': strCBright});
					}
				});
			}
		}else{
			objTD.css({'background-color': strCDark});
		}
	});
}


function getString(arrParam, strTargID){
	//console.log(arrParam['mod']);
	/*$.ajax('',{
		type: 'POST',
		data: arrParam,
		dataType: 'text'
	})
	.done(function(strRes){
		$(strTargID).text('');
		$(strTargID).append(strRes);
	})
	.fail(function(){
		$(strTargID).text('-- Javascript error --');
	});*/
	if(strSelf.indexOf('index.html') == 0){
		alert('The original function when clicking this button is to sort via PHP.');
	}else if(strSelf == 'addnew.html'){
		alert('The original function when selecting from this menu is to load the past product data via PHP.');
	}
}


function clearForm(strTarg){
	$(strTarg)
		.find('input, textarea')
		.not(':button, :submit, :reset, :hidden, :checkbox, :radio')
		.val('')
		.prop('checked', false)
		.prop('selected', false)
	;
	$(strTarg).find('select').val('--');
	$(strTarg).find('input:checkbox').each(function(index, element){
		$(element).prop('checked', false);
	});
	$(strTarg).find('input:radio').each(function(index, element){
		$(element).prop('checked', false);
	});

	$(strTarg).find(':radio').filter('[data-default]').prop('checked', true);
	$(strTarg).find('select').children('option').each(function(index, element){
		$(element).removeClass('sel');
	});
}
function clearForminDiv(){
	clearForm($('#task_form'));
	clearForm($('#div_form'));
	$('#tgl_trgt').prop('checked', true);
	$('[id^=trgt]').each(function(index, element){
		$(element).prop('checked', true);
	});
	$('[id^=pic_stts]').each(function(index, element){
		$(element).val(1);
	});
	$('[id^=rdmc_stts]').each(function(index, element){
		$(element).val(1);
	});
	window.sessionStorage.clear();
}

function chkUA(){
	var userAgent = window.navigator.userAgent.toLowerCase();

	if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1){
		return 'IE';
	}else if(userAgent.indexOf('edge') != -1){
		return 'Edge';
	}else if(userAgent.indexOf('chrome') != -1){
		return 'Chrome';
	}else if(userAgent.indexOf('safari') != -1){
		return 'Safari';
	}else if(userAgent.indexOf('firefox') != -1){
		return 'FireFox';
	}else if(userAgent.indexOf('opera') != -1){
		return 'Opera';
	}else{
		return false;
	}
}