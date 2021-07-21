var editor=ace.edit("editor");var editorTheme="dracula";var Range=ace.require("ace/range").Range;var storedCode=false;var language="cpp";var testInput="";var problemType=pid>7e5?"Function":"Full";var defaultCode="";var defaultLang=currentProblem.default_lang;var userDefaultCode=currentProblem.default_code;var submissionType="";var disabledLines={};var initialCode={};var userFunc={};var hintsFetched=false;var problemSolved=false;function isLocalStorageAvailable(){var testString="test";try{localStorage.setItem(testString,testString);localStorage.removeItem(testString);return true}catch(e){if(e.name=="QuotaExceededError"){localStorage.clear();return true}else{return false}}}const IS_LOCAL_STORAGE_AVAILABLE=isLocalStorageAvailable();if(IS_LOCAL_STORAGE_AVAILABLE&&localStorage.getItem("DELETE_THIS_KEY_LATER")==null&&localStorage.getItem("problemsGFG")!=null){localStorage.setItem("DELETE_THIS_KEY_LATER",localStorage.getItem("problemsGFG"))}function assert(condition,message){if(!condition){throw new Error(message||"Assertion failed")}}function escapeHtml(text){return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}class UserProblemsLocalStorage{static get keyName(){return"problemsGFGNew"}static get backupKeyName(){return"problemsGFG"}static getAllData(keyName=UserProblemsLocalStorage.keyName){var data=localStorage.getItem(keyName);if(data!=null)return JSON.parse(data);return JSON.parse("{}")}static setAllData(data,keyName=UserProblemsLocalStorage.keyName){localStorage.setItem(keyName,JSON.stringify(data))}static hasProblemData(pid){return pid in UserProblemsLocalStorage.getAllData()}static getDefaultLanguage(pid){return UserProblemsLocalStorage.getAllData()[pid]["lang"]}static setDefaultLanguage(pid,lang){data=UserProblemsLocalStorage.getAllData();data[pid]["lang"]=lang;UserProblemsLocalStorage.setAllData(data)}static updateOrInsertProblemDataIfNotExists(pid,lang,code,testInput,updatedAt){try{assert(pid!=null);assert(lang!=null);assert(updatedAt!=null)}catch(error){console.error(error.stack);return}var localStorageData=UserProblemsLocalStorage.getAllData();if(pid in localStorageData){localStorageData[pid]["lang"]=lang;localStorageData[pid]["testInput"]=testInput}else{localStorageData[pid]={lang:lang,testInput:testInput}}localStorageData[pid][lang]={code:code,updatedAt:updatedAt};UserProblemsLocalStorage.setAllData(localStorageData)}}getDefaultCode(problemType,function(systemCode){defaultCode=systemCode});function isCodeDefault(code){for(var key in defaultCode){if(code==defaultCode[key]){return true}}return false}function getDisabledLines(language,storedCode=0){var replacePos=initialCode[language].indexOf("//Position this line where user code will be pasted");disabledLines[language]=[];if(replacePos!=-1){if(language=="python"||language=="python3"){var InitialText="#{ \n#Driver Code Starts"+"\n"+initialCode[language].substr(0,replacePos)+"\n"+" # } Driver Code Ends";var afterUserFunc=initialCode[language].substr(replacePos).replace("//Position this line where user code will be pasted","\n#{ \n#Driver Code Starts")+"\n#} Driver Code Ends"}else{var InitialText="// { Driver Code Starts"+"\n"+initialCode[language].substr(0,replacePos)+"\n"+" // } Driver Code Ends";var afterUserFunc=initialCode[language].substr(replacePos).replace("//Position this line where user code will be pasted","\n// { Driver Code Starts")+"  // } Driver Code Ends"}var defaultCode=InitialText+"\n"+userFunc[language]+"\n"+afterUserFunc;disabledLines[language][0]=InitialText.split(/\r\n|\r|\n/).length;var codeBeforeSecondDisable=InitialText+"\n"+userFunc[language];disabledLines[language][1]=codeBeforeSecondDisable.split(/\r\n|\r|\n/).length+2;disabledLines[language][2]=defaultCode.split(/\r\n|\r|\n/).length}else{if(language=="python"||language=="python3"){if(storedCode==0){initialCode[language]="#{ \n#  Driver Code Starts"+"\n"+initialCode[language]+"\n"+"# } Driver Code Ends"}var defaultCode=userFunc[language]+"\n\n"+initialCode[language];disabledLines[language][0]=userFunc[language].split(/\r\n|\r|\n/).length+2;disabledLines[language][1]=defaultCode.split(/\r\n|\r|\n/).length}else{if(storedCode==0){initialCode[language]="// { Driver Code Starts"+"\n"+initialCode[language]+"// } Driver Code Ends"}var defaultCode=initialCode[language]+"\n\n\n"+userFunc[language];disabledLines[language][0]=initialCode[language].split(/\r\n|\r|\n/).length}}return defaultCode}function storedCodeDisabledLines(storedCode,language){if((language=="python"||language=="python3")&&disabledLines[language].length!=3){disabledLines[language][0]=storedCode.substr(0,storedCode.indexOf("Driver Code Starts")).split(/\r\n|\r|\n/).length-1;disabledLines[language][1]=storedCode.substr(0,storedCode.indexOf("Driver Code Ends")).split(/\r\n|\r|\n/).length}else if(disabledLines[language].length!=3){disabledLines[language][0]=storedCode.substr(0,storedCode.indexOf("Driver Code Ends")).split(/\r\n|\r|\n/).length}else{disabledLines[language][0]=storedCode.substr(0,storedCode.indexOf("Driver Code Ends")).split(/\r\n|\r|\n/).length;if(language=="python"||language=="python3"){disabledLines[language][1]=storedCode.substr(0,storedCode.lastIndexOf("Driver Code Starts")).split(/\r\n|\r|\n/).length-1}else{disabledLines[language][1]=storedCode.substr(0,storedCode.lastIndexOf("Driver Code Starts")).split(/\r\n|\r|\n/).length-1}disabledLines[language][2]=storedCode.substr(0,storedCode.lastIndexOf("Driver Code Ends")).split(/\r\n|\r|\n/).length}}function getDefaultCode(problemType,callback){if(problemType=="Full"){var defaultC=defaultLang=="c"?userDefaultCode:"#include <stdio.h>\n\nint main() {\n\t//code\n\treturn 0;\n}";var defaultCPP=defaultLang=="cpp"?userDefaultCode:"#include <iostream>\nusing namespace std;\n\nint main() {\n\t//code\n\treturn 0;\n}";var defaultJava=defaultLang=="java"?userDefaultCode:"/*package whatever //do not write package name here */\n\nimport java.util.*;\nimport java.lang.*;\nimport java.io.*;\n\nclass GFG {\n\tpublic static void main (String[] args) {\n\t\t//code\n\t}\n}";var defaultPython=defaultLang=="python"?userDefaultCode:"#code";var defaultCsharp=defaultLang=="csharp"?userDefaultCode:'using System;\npublic class GFG {\n\tstatic public void Main () {\n\t\tConsole.WriteLine("Hello World!");\n\t}\n}';var defaultJavascript=def_lang=="javascript"?userDefaultCode:'console.log("Hello Javascript !")';callback({c:defaultC,cpp:defaultCPP,java:defaultJava,python:defaultPython,python3:defaultPython,csharp:defaultCsharp,javascript:defaultJavascript})}else if(problemType=="Function"){var prependTextPython="''' "+"This is a function problem.You only need to complete the function given below"+" '''";var prependTextOther="/*This is a function problem.You only need to complete the function given below*/";var functionProblems=currentProblem["initial_user_func"];if("cpp"in functionProblems){initialCode["cpp"]=functionProblems["cpp"]["initial_code"];userFunc["cpp"]=functionProblems["cpp"]["user_code"];var defaultCpp=getDisabledLines("cpp")}if("c"in functionProblems){initialCode["c"]=functionProblems["c"]["initial_code"];userFunc["c"]=functionProblems["c"]["user_code"];var defaultC=getDisabledLines("c")}if("java"in functionProblems){initialCode["java"]=functionProblems["java"]["initial_code"];userFunc["java"]=functionProblems["java"]["user_code"];var defaultJava=getDisabledLines("java")}if("python"in functionProblems){initialCode["python"]=functionProblems["python"]["initial_code"];userFunc["python"]=functionProblems["python"]["user_code"];var defaultPython=getDisabledLines("python")}if("python3"in functionProblems){initialCode["python3"]=functionProblems["python3"]["initial_code"];userFunc["python3"]=functionProblems["python3"]["user_code"];var defaultPython3=getDisabledLines("python3")}if("csharp"in functionProblems){initialCode["csharp"]=functionProblems["csharp"]["initial_code"];userFunc["csharp"]=functionProblems["csharp"]["user_code"];var defaultCsharp=getDisabledLines("csharp")}if("javascript"in functionProblems){initialCode["javascript"]=functionProblems["javascript"]["initial_code"];userFunc["javascript"]=functionProblems["javascript"]["user_code"];var defaultJavascript=getDisabledLines("javascript")}callback({c:typeof defaultC!=="undefined"&&defaultC!=""?defaultC:null,cpp:typeof defaultCpp!=="undefined"&&defaultCpp!=""?defaultCpp:null,java:typeof defaultJava!="undefined"&&defaultJava!=""?defaultJava:null,python:typeof defaultPython!="undefined"&&defaultPython!=""?defaultPython:null,python3:typeof defaultPython3!="undefined"&&defaultPython3!=""?defaultPython3:null,csharp:typeof defaultCsharp!="undefined"&&defaultCsharp!=""?defaultCsharp:null,javascript:typeof defaultJavascript!="undefined"&&defaultJavascript!=""?defaultJavascript:null})}}function updateProblemTheme(){var previousTheme=IS_LOCAL_STORAGE_AVAILABLE?localStorage.getItem("editorTheme"):null;if(previousTheme){editorTheme=previousTheme}editor.setTheme("ace/theme/"+editorTheme);if(editorTheme=="xcode"){$(".footer-editor").css("background","#F3F4F5");$("#avgTime, #timeElapsed").css("color","#000");$("#darkTheme").show();$("#lightTheme").hide()}else{$(".footer-editor").css("background","#1D1E27");$("#avgTime, #timeElapsed").css("color","#fff");$("#lightTheme").show();$("#darkTheme").hide()}}function saveEditorChanges(){if(!IS_LOCAL_STORAGE_AVAILABLE){console.log("Local Storage is not available");return}var localStorageData=UserProblemsLocalStorage.getAllData();if(localStorageData=={}){UserProblemsLocalStorage.setAllData({})}var code=editor.session.getValue();var testInput=testArea.value;var lang=language;if(lang!=""&&$.trim(code)!=""&&!isCodeDefault(code)){if(problemType=="Function"&&lang in currentProblem["initial_user_func"]){var initialDriverCodeUpdatedAt=currentProblem["initial_user_func"][lang]["updated_at_timestamp"];UserProblemsLocalStorage.updateOrInsertProblemDataIfNotExists(pid,lang,code,testInput,initialDriverCodeUpdatedAt)}else{UserProblemsLocalStorage.updateOrInsertProblemDataIfNotExists(pid,lang,code,testInput,0)}}}$(window).on("beforeunload",function(){saveEditorChanges()});function setEditorMode(language){var mode;if(language=="c"){mode="c_cpp"}else if(language=="cpp"){mode="c_cpp"}else if(language=="python"){mode="python"}else if(language=="python3"){mode="python"}else if(language=="java"){mode="java"}else if(language=="csharp"){mode="csharp"}else if(language=="javascript"){mode="javascript"}if(problemType=="Full"){editor.getSession().setMode("ace/mode/"+mode)}else{if(disabledLines[language].length!=3){var startRange=language=="python"||language=="python3"?disabledLines[language][0]:1;var endRange=language=="python"||language=="python3"?disabledLines[language][1]:disabledLines[language][0];disableRanges(startRange,endRange);editor.getSession().addFold("...",new Range(startRange-1,0,endRange-1,0))}else{disableRanges(0,disabledLines[language][0]);disableRanges(disabledLines[language][1],disabledLines[language][2]);editor.getSession().addFold("...",new Range(0,0,disabledLines[language][0]-1,0));editor.getSession().addFold("...",new Range(disabledLines[language][1]-1,0,disabledLines[language][2]-1,0))}editor.getSession().setMode("ace/mode/"+mode)}}function disableRanges(startLine,endLine){var editor=ace.edit("editor"),session=editor.getSession(),Range=ace.require("ace/range").Range,range=new Range(startLine-1,0,endLine,0),markerId=session.addMarker(range,"ace_selection");session.setMode("ace/mode/javascript");editor.keyBinding.addKeyboardHandler({handleKeyboard:function(data,hash,keyString,keyCode,event){if(hash===-1||keyCode<=40&&keyCode>=37)return false;if(intersects(range)){return{command:"null",passEvent:false}}}});before(editor,"onPaste",preventReadonly);before(editor,"onCut",preventReadonly);range.start=session.doc.createAnchor(range.start);range.end=session.doc.createAnchor(range.end);range.end.$insertRight=true;function before(obj,method,wrapper){var orig=obj[method];obj[method]=function(){var args=Array.prototype.slice.call(arguments);return wrapper.call(this,function(){return orig.apply(obj,args)},args)};return obj[method]}function intersects(range){return editor.getSelectionRange().intersects(range)}function preventReadonly(next,args){if(intersects(range))return;next()}}function showSnackbarMessage(msg,duration=3e3,onlyFadeIn=false){$("#gfg-snackbar").text(msg);$("#gfg-snackbar").addClass("show");if(onlyFadeIn){$("#gfg-snackbar.show").css("animation","fadein 0.5s")}setTimeout(function(){$("#gfg-snackbar").removeClass("show")},duration)}$(document).ready(function(){$(".loadScreen").hide();$(".problemQuestion img").addClass("img-responsive");var testArea=document.getElementById("testArea");ace.require("ace/ext/language_tools");editor.$blockScrolling=Infinity;editor.setOption("showPrintMargin",false);updateProblemTheme();function toggleFullScreen(){var aceEditor=document.getElementById("editor");if(aceEditor.requestFullscreen){aceEditor.requestFullscreen()}else if(aceEditor.msRequestFullscreen){aceEditor.msRequestFullscreen()}else if(aceEditor.mozRequestFullScreen){aceEditor.mozRequestFullScreen()}else if(aceEditor.webkitRequestFullscreen){aceEditor.webkitRequestFullscreen()}}$("#darkTheme, #lightTheme").click(function(){editorTheme=editorTheme=="dracula"?"xcode":"dracula";if(localStorage)localStorage.setItem("editorTheme",editorTheme);updateProblemTheme()});$("#zoom").click(function(){toggleFullScreen()});$(document).on("keyup",function(evt){if(evt.keyCode==27&&$("body").hasClass("fullScreen")){toggleFullScreen();e.preventDefault()}});function resetEditor(){if(problemType=="Full"){editor.getSession().setValue(defaultCode[language]);setEditorMode(language)}else{var results=getDisabledLines(language,1);editor.getSession().setValue(results);setEditorMode(language)}var data=UserProblemsLocalStorage.getAllData();if(pid in data&&language in data[pid]){delete data[pid][language];data[pid]["lang"]=null;UserProblemsLocalStorage.setAllData(data)}}$("#resetEditor").click(function(){if(confirm("Do you really want to reset your code in the editor?")){resetEditor()}});var data;var codeResetted;languagesRequiringCodeReset=[];function getLanguagesThatRequiresCodeEditorReset(){if(problemType!="Function")return[];var data=UserProblemsLocalStorage.getAllData();var languageRequiringResetEditor=[];Object.keys(currentProblem["initial_user_func"]).forEach(currentLanguage=>{try{if(pid in data&&data[pid]!=null&&currentLanguage in data[pid]){driverCodeLastUpdatedAtInDb=currentProblem["initial_user_func"][currentLanguage]["updated_at_timestamp"];driverCodelastSavedUpdateTimestamp=data[pid][currentLanguage]["updatedAt"];if(driverCodeLastUpdatedAtInDb>driverCodelastSavedUpdateTimestamp){languageRequiringResetEditor.push(currentLanguage)}}}catch(error){console.error(error.stack)}});return languageRequiringResetEditor}function handleCodeUpdatesForProblems(){if(!IS_LOCAL_STORAGE_AVAILABLE)return;if(problemType!="Function")return;var data=UserProblemsLocalStorage.getAllData();var backupData=UserProblemsLocalStorage.getAllData(UserProblemsLocalStorage.backupKeyName);if(pid in data){if(languagesRequiringCodeReset.length>0){for(var i=0;i<languagesRequiringCodeReset.length;i++){currentLanguage=languagesRequiringCodeReset[i];if(codeResetted.has(currentLanguage))continue;if(!(pid in backupData)){backupData[pid]={lang:language}}backupData[pid][currentLanguage]=data[pid][currentLanguage]["code"];UserProblemsLocalStorage.setAllData(backupData,UserProblemsLocalStorage.backupKeyName);if(currentLanguage==language){resetEditor();codeResetted.add(currentLanguage)}}if(codeResetted.has(language)){$("#last-backup-code").parent().addClass("blink_me");setTimeout(function(){$("#last-backup-code").parent().removeClass("blink_me")},15e3)}}}if(pid in backupData&&backupData[pid]!=null&&language in backupData[pid]){$("#last-backup-code").show()}}autoSave=setInterval(function(){saveEditorChanges()},5e3);document.getElementById("languageDropdown").onchange=function(){saveEditorChanges();onChangeLanguageSelected()};function onChangeLanguageSelected(){$("#last-backup-code").parent().removeClass("blink_me");$("#last-backup-code").hide();language=$("#languageDropdown").val();handleCodeUpdatesForProblems();var data=IS_LOCAL_STORAGE_AVAILABLE?UserProblemsLocalStorage.getAllData():null;if(data!=null&&data[pid]!=null&&data[pid][""+language]!=undefined&&$.trim(data[pid][""+language]["code"])!=""){testArea.value=data[pid]["testInput"];editor.session.setValue(data[pid][""+language]["code"]);if(problemType=="Function"){storedCodeDisabledLines(data[pid][""+language]["code"],language)}}else{editor.session.setValue(defaultCode[language])}setEditorMode(language)}$("#customInputCheckbox").click(function(){if($(this).is(":checked")){$("#customInputTestModal").modal()}});$("#customInputTestModal").on("hidden.bs.modal",function(){$("#customInputCheckbox").click()});var subResult;var isSubmissionQueued=false;var subId=0;var ajaxRequest;function setIntervalX(callback,delay,repetitions){var x=0;subResult=window.setInterval(function(){callback();if(++x===repetitions){window.clearInterval(subResult);isSubmissionQueued=false}},delay)}$("#run, #testRun, #expectedRun, #customInputTestRun").click(function(e){var requestType=$(this).attr("id");$("#outputBlock").show();$(".out").show();$(".output-modal-close").hide();$(".output-modal-open").show();e.preventDefault();var data={};if(isSubmissionQueued!=false){if(confirm("You have one request in queue already. Are you sure you want to make another submission?")){if(subId!=0){data["prevSubId"]=subId}clearInterval(subResult)}else{return}}var text=editor.getSession().getValue();var lines=text.split("\n");var code=lines.join("\n");if(language==="python3"){code=code.replace(/\t/g,"    ")}if(requestType=="run"){data["request_type"]="solutionCheck";data["code"]=code;data["language"]=language;data["track"]=track;submissionType="solutionCheck"}else if(requestType=="testRun"||requestType=="customInputTestRun"){data["request_type"]="testSolution";submissionType="testSolution";if(requestType=="testRun"){data["input"]=sampleTestCases}else{if(testArea.value.trim()==""){alert("Please enter custom input to run");return}data["input"]=testArea.value}data["code"]=code;data["language"]=language}else if(requestType=="expectedRun"){if(testArea.value.trim()==""){alert("Please enter custom input to run");return}data["request_type"]="expectedOutput";submissionType="expectedOutput";data["input"]=testArea.value}data["source"]=URLHOME;$(this).attr("disabled","disabled");$(".out").html('<div class="cmp_rsp"><h3>Queuing <i class="fa fa-spinner fa-spin"></i></h3></div>');isSubmissionQueued=true;var requestCount=0;if(requestType=="expectedRun"||requestType=="customInputTestRun"){$("#customInputTestModal").modal("hide")}var compilerRequestId=setInterval(function compilerRequest(){if(ajaxRequest&&ajaxRequest.readyState!=4){ajaxRequest.abort()}if(requestCount>=2){clearInterval(compilerRequestId);return}data["batch_id"]=batch_id;data["track_id"]=track_id;ajaxRequest=$.ajax({type:"POST",url:practiceApiHost+"problems/"+problemSlug+"/compile/",crossDomain:true,data:data,dataType:"json",xhrFields:{withCredentials:true},success:function(response){clearInterval(compilerRequestId);if(response.hasOwnProperty("errorMessage")){isSubmissionQueued=false;$(".out").html(response["errorMessage"])}else{$(".out").html('<div class="cmp_rsp"><h3>Request Queued.<br><span style="color:green">Ready for evaluation &nbsp<i class="fa fa-spin fa-spinner"></i></h3></div>');if(response.hasOwnProperty("results")){subId=response["results"]["submission_id"];setIntervalX(function(){getSubmissionsResults(subId,submissionType)},3e3,20)}}},error:function(jqXHR,exception,errorThrown){logoutIf403(jqXHR);if(jqXHR.status==403)return;if(requestCount>=2){isSubmissionQueued=false;$(".out").html('<div class="cmp_rsp"><h3>Error / Run TimeError.\n Try again</h3></div>');$(".err").show().delay(5e3).slideUp(200,function(){$(this).hide()})}},complete:function(){$("#"+requestType).removeAttr("disabled")}});requestCount+=1;return compilerRequest}(),1e4)});$("body").on("click","#show-hints",function(event){event.preventDefault();if(!hintsFetched)fetchProblemHints();$("#hintsModal").modal("show")});$("body").on("click","#last-backup-code",function(event){event.preventDefault();$(this).parent().removeClass("blink_me");var user_code_data=UserProblemsLocalStorage.getAllData(UserProblemsLocalStorage.backupKeyName);var user_code;if(pid in user_code_data&&user_code_data[pid]!=null&&language in user_code_data[pid]){user_code=user_code_data[pid][language]}else{return}var win=window.open("","","toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width="+screen.width/2+",height="+screen.height+",top=0,left=0");win.document.title="Backup Code";win.document.body.innerHTML="<pre>"+escapeHtml(user_code)+"</pre>";win.focus()});function hintsSolution(solutions){var solutionNavHTML='<ul class="nav nav-tabs sol-tabs">';var solutionContentHTML='<div class="tab-content full-soln-lang" style="padding:10px 0;">';var i=1;let lang_dict={"C++":"cpp",Java:"java",Python3:"python3",Javascript:"javascript",C:"c",PHP:"php","C#":"csharp"};for(const solution of solutions){if(solution["full_func"]!=null){solutionNavHTML+="<li"+((courseDefaultLang?courseDefaultLang==lang_dict[solution["lang"]]:i==1)?' class="active"':"")+'><a data-toggle="tab" href="#Tab'+i+'">'+solution["lang"]+"</a></li>";solutionContentHTML+='<div id="Tab'+i+'" class="tab-pane fade'+((courseDefaultLang?courseDefaultLang==lang_dict[solution["lang"]]:i==1)?" active in":"")+'">';var code=solution["full_func"];code=code.replace(/</g,"&lt;");code=code.replace(/>/g,"&gt;");solutionContentHTML+='<pre class="prettyprint">'+code+"</pre></div>";i++}}return solutionNavHTML+"</ul>"+solutionContentHTML+"</div>"}function fetchProblemHints(activeHint=1){$.ajax({type:"GET",url:practiceApiHost+"problems/"+problemSlug+"/hints/",crossDomain:true,xhrFields:{withCredentials:true},success:function(response){if(response.hasOwnProperty("results")){response=response.results;if(response.user_has_solved_problem==true){problemSolved=true}var navHTML='<ul class="nav hint-tabs nav-tabs">';var contentHTML="<div class='tab-content' style='padding:10px 0;'>";var i=1;for(i=1;i<=response.total_hints;i++){contentHTML+="<div id='hint"+i+"' class='tab-pane fade "+(i==activeHint?" in active":"")+"'>";if(i>response.unlock_hints_upto){navHTML+="<li class='"+(i==activeHint?"active":"")+"'><a data-toggle='tab' class='locked-hint-tab' id='"+i+"' marks='"+response.hints_access_marks[i-1]+"' href='#hint"+i+"'><i class='fa fa-lock'></i> Hint "+i+"</a> </li>";contentHTML+="<p>Accessing this hint will deduct <b>total "+response.hints_access_marks[i-1]+" marks</b> from total score of this problem,<br/> and will unlock all previous hints.</p>"}else{navHTML+="<li class='"+(i==activeHint?"active":"")+"'><a data-toggle='tab' id='"+i+"' marks='"+response.hints_access_marks[i-1]+"' href='#hint"+i+"'><i class='fa fa-unlock'></i> Hint "+i+"</a> </li>";contentHTML+=response.hints[i-1]}contentHTML+="</div>"}contentHTML+="<div id='fullSoln' class='tab-pane fade "+(i==activeHint?" in active":"")+"'>";if(response.full_solution){navHTML+='<li class="'+(i==activeHint?"active":"")+'"><a id="solution" data-toggle="tab" href="#fullSoln"> <i class="fa fa-unlock"></i> Full Solution</a> </li>';contentHTML+=hintsSolution(response.full_solution)}else{navHTML+='<li class="'+(i==activeHint?"active":"")+'"><a class="locked-hint-tab" id="solution" data-toggle="tab" href="#fullSoln"> <i class="fa fa-lock"></i> Full Solution</a> </li>';contentHTML+="<p>If you see the full solution before solving the problem, then marks for this problem will not be added to your score.</p>"}navHTML+="</ul>";contentHTML+="</div></div>";$(".hints-modal-body").html(navHTML+contentHTML);PR.prettyPrint()}else{showSnackbarMessage(response["message"])}},error:function(jqXHR,exception,errorThrown){logoutIf403(jqXHR);if(jqXHR.status==403)return;showSnackbarMessage("Some Error Occured")},complete:function(){hintsFetched=true;$("#hintsModal img").addClass("img-responsive")}})}$("body").on("click",".locked-hint-tab",function(event){var thisTab=$(this);$(thisTab).disabled=true;var thisHintText=$($(thisTab).attr("href")).text().trim();if(problemSolved==true||confirm(thisHintText)){var hintNum=$(thisTab).attr("id");var activeHint=hintNum;if(hintNum=="solution"){activeHint=$(".hint-tabs").children().length;$("#fullSoln").html('<span class="fa fa-spin fa-spinner" style="top: 50%;left: 50%;transform: translate(50%);font-size: 30px;position: relative;"></span>')}$.ajax({type:"GET",url:practiceApiHost+"problems/"+problemSlug+"/hints/"+hintNum+"/",crossDomain:true,xhrFields:{withCredentials:true},success:function(response){if(response.hasOwnProperty("results")){fetchProblemHints(activeHint)}else{showSnackbarMessage(response["message"])}},error:function(jqXHR,exception,errorThrown){showSnackbarMessage("Some Error Occured")},complete:function(){$(thisTab).disabled=false}})}});function getSubmissionsResults(id,type){$.ajax({type:"POST",url:practiceApiHost+"problems/submission/result/",crossDomain:true,data:{sub_id:id,sub_type:type},dataType:"json",xhrFields:{withCredentials:true},success:function(response){status=response.status;message=response.message;if(status=="SUCCESS"){$(".out").html("");clearInterval(subResult);viewMode=response.view_mode;viewCases=response.view_cases;if(message==""){console.log("message is None");return false}var execTime=submissionResponse="";var correctFound=0;if(message.hasOwnProperty("exec_time")&&(viewMode=="runtime"||viewMode=="optimize"||viewMode=="correct"||viewMode=="wrong_cp"||viewMode=="wrong_p")){if(message.exec_time.hasOwnProperty("actual_exec_time")){execTime=message.exec_time!=""?"Actual ExecTime: "+message.exec_time.actual_exec_time.toFixed(2)+" Calculated TimeLimit: "+message.exec_time.calculated_exec_time.toFixed(2):""}}if(viewMode=="NOK"){submissionResponse=message.error}else if(viewMode=="compilation"){submissionResponse="<div class='cmp_rsp'><h3>Compilation Error <img src='https://media.geeksforgeeks.org/img-practice/Group86-1623298005.png'></h3>";submissionResponse+="<div class='cmp_pre'>"+message.error+"</div></div>"}else if(viewMode=="runtime"){submissionResponse="<div class='cmp_rsp'><h3>Runtime Error <img src='https://media.geeksforgeeks.org/img-practice/Group86-1623298005.png'></h3>";submissionResponse+="<div class='cmp_pre'>"+message.error+"";if(viewCases["segfault"]==1){submissionResponse+="Learn More about";submissionResponse+="<a href='https://www.geeksforgeeks.org/core-dump-segmentation-fault-c-cpp/'>Seg Fault</a><br>"}if(viewCases["TLE"]==1){submissionResponse+="<br>Your program took more time than expected.";submissionResponse+="<img style='position: relative; top: 2px; left: 5px; height: 27px; margin-right:10px;' src='"+URLS3+"img-practice/tle.png' border='0' title='Time Limit Exceeded' alt='Time Limit Exceeded'><br>";submissionResponse+="Expected Time Limit "+message.time_upper_bound.toFixed(2)+"sec<br>Hint : Please optimize your code and submit again.<br>"+execTime}submissionResponse+="</div></div>"}else if(viewMode=="optimize"){submissionResponse="<div class='cmp_rsp'><h3>Your program took more time than expected</h3>";submissionResponse+="<div class='cmp_pre'>Expected Time Limit "+message.time_upper_bound.toFixed(2)+"sec<br>Hint : Please optimize your code and submit again.<br>"+execTime+"</div></div>"}else if(viewMode=="test_results"){submissionResponse="<div class='cmp_rsp'><h3>Compilation Successful <img src='https://media.geeksforgeeks.org/img-practice/Group85-1623146693.png'></h3><div class='cmp_pre'><span>For Input:</span>"+message.input+"<br><br><span>"+message.output_type+"</span>"+message.output+"</div></div>"}else if(viewMode=="correct"){problemSolved=true;$(".problems-list-menu__navbar-body-list__group > li > a.active > i").removeClass("far fa-circle");$(".problems-list-menu__navbar-body-list__group > li > a.active > i").addClass("fas fa-check-circle");submissionResponse="<div class='cmp_rsp'><h3>Problem Solved Successfully <img src='https://media.geeksforgeeks.org/img-practice/Group85-1623146693.png'></h3>";if(message.full_solution_visited!="False"){submissionResponse+="<div style='text-align:right'><img src='https://media.geeksforgeeks.org/img-practice/Group84-1623398180.png'> You have already visited Full solution on "+message.full_solution_visited.slice(0,message.full_solution_visited.length-9);+"</div>"}submissionResponse+="<div class='row'>";submissionResponse+="<div class='col-sm-6' style='margin-bottom:30px'><div class='summary_inner_div'><div>Total Points Scored:</div><span class='big_val'>"+message.user_score+"</span><span class='small_val'>/"+message.problem_max_score+"</span></div></div>";submissionResponse+="<div class='col-sm-6' style='margin-bottom:30px'><div class='summary_inner_div'><div>Total Time Taken:</div><span class='big_val' style='color:#2F8D46'>"+message.execution_time.toFixed(1)+"</span><span class='small_val'>/"+message.time_upper_bound.toFixed(1)+"</span></div></div>";submissionResponse+="<div class='col-sm-6' style='margin-bottom:30px'><div class='summary_inner_div'><div>Your Accuracy:</div><span class='big_val' style='color:#ECB620'>"+message.accuracy+"%</span></div></div>";submissionResponse+="<div class='col-sm-6' style='margin-bottom:30px'><div class='summary_inner_div'><div>Attempts No.:</div><span class='big_val' style='color:#F13434'>"+message.attempt_count+"</span></div></div>";if(!$.isEmptyObject(message.suggest_next_problem)){var nextProblemType=message.suggest_next_problem.id>7e5?0:1;var nextProblemSlug=message.suggest_next_problem.slug;var nextProblemName=message.suggest_next_problem.problem_name;submissionResponse+="<br><strong style='color:#2F8D46;'>Next Suggested Problem: <a href='/problems/"+nextProblemSlug+"/"+nextProblemType+"/?"+window.location.href.split("?")[1]+"'>"+nextProblemName+"</a></strong>"}submissionResponse+="</div></div>";correctFound=1}else if(viewMode=="wrong_cp"){submissionResponse="<div class='cmp_rsp'><h3>Wrong Answer. !!! <img src='https://media.geeksforgeeks.org/img-practice/Group86-1623298005.png'></h3><div class='cmp_pre'>"+execTime+"</div></div>"}else if(viewMode=="wrong_p"){submissionResponse="<div class='cmp_rsp'><h3>Wrong Answer !!! <img src='https://media.geeksforgeeks.org/img-practice/Group86-1623298005.png'></h3><div class='cmp_pre'>";submissionResponse+=execTime;submissionResponse+="<br>Possibly your code doesn't work correctly for multiple test-cases (TCs).<br><br>";submissionResponse+="The first test case where your code failed:<br><br><span style='color:green'>Input:</span><br>"+message.file_input;submissionResponse+="<br><br><span style='color:green'>Its Correct output is:</span><br>"+message.file_output+"<br><br>";submissionResponse+="<span style='color:green'>And Your Code's output is:</span><br>"+message.code_output+"</div></div>"}$(".out").html(submissionResponse);if(correctFound){clearInterval(problemTimer);var hasQueryParam=window.location.href.split("?")[1];if(hasQueryParam!==undefined){var _href=$("a.nextProblem").attr("href");$("a.nextProblem").attr("href",_href+"?"+hasQueryParam)}}if(type=="solutionCheck"){updateUserScore()}}else if(status=="PICKED"||status=="QUEUED"){$(".out").html(message+"<div class='cmp_rsp'><h3><span style='color:green'>&nbspEvaluating&nbsp<i class='fa fa-spin fa-spinner'></i><span></h3></div>")}else if(status=="FAILED"){clearInterval(subResult);$(".out").html("");$(".out").append(message);console.log("failed case executed")}else if(status==""){return}},error:function(jqXHR,exception,errorThrown){$(".out").html('<div class="cmp_rsp"><h3>Error / Run TimeError.\n Try again</h3></div>');$(".err").show().delay(5e3).slideUp(200,function(){$(this).hide()})},complete:function(){isSubmissionQueued=false}})}function updateUserScore(){$.ajax({type:"POST",url:"/ajax/getUserScore.php",success:function(response){response=JSON.parse(response);if(response.status=="SUCCESS"){var score=$(".userScore").first().text();$(".userScore").text(response.results.score);$(".userMonthlyScore").text(response.results.monthly_score);if(Number(score)>Number(response.results.score)){$(".scoreDown").show();$(".scoreUp").hide()}else if(Number(score)<Number(response.results.score)){$(".scoreUp").show();$(".scoreDown").hide()}else{$(".scoreDown").hide();$(".scoreUp").hide()}let milestonePoints=100;if(userHasAccessToApplyJob)return;if(Number(response.results.score)<milestonePoints){let remainingPoints=milestonePoints-Number(response.results.score);$(".out").append("<br><br><div class='jobPortalAccessMessage'>Your current score is "+response.results.score+". Score "+remainingPoints+" more to get access to premium Jobs portal and stand a chance to get your dream placement</div>")}else{userHasAccessToApplyJob=true;if(Number(score)<milestonePoints){$(".out").append("<br/><div class='jobPortalAccessMessage'>Congratulations, You have unlocked access to premium Jobs portal</div>")}}}else{showSnackbarMessage(response.message)}},error:function(jqXHR,exception,errorThrown){showSnackbarMessage("Some Error Occured")},complete:function(){}})}if(IS_LOCAL_STORAGE_AVAILABLE){data=UserProblemsLocalStorage.getAllData();if(data!={}&&data[pid]!=null&&data[pid]["lang"]!=null&&data[pid][data[pid]["lang"]]!=null){language=data[pid]["lang"];storedCode=$.trim(data[pid][""+language]["code"])!=""?data[pid][""+language]["code"]:storedCode;testInput=data[pid]["testInput"]}}if(storedCode){testArea.value=testInput;$("#languageDropdown").selectpicker("val",language);if(problemType!="Full"){if(disabledLines[language].length==3||language=="python"||language=="python3"){storedCodeDisabledLines(storedCode,language)}}editor.session.setValue(storedCode);setEditorMode(language)}else{if(courseDefaultLang&&currentProblem!=null&&currentProblem.problem_languages!=null&&Object.keys(currentProblem.problem_languages).includes(courseDefaultLang)){$("#languageDropdown").selectpicker("val",courseDefaultLang)}else if(!!defaultLang&&!!defaultCode[defaultLang]){if(defaultLang=="python")defaultLang="python3";$("#languageDropdown").selectpicker("val",defaultLang)}else{for(var key in defaultCode){if(defaultCode[key]!=null){$("#languageDropdown").selectpicker("val",key);break}}}onChangeLanguageSelected()}if(!IS_LOCAL_STORAGE_AVAILABLE)return;languagesRequiringCodeReset=getLanguagesThatRequiresCodeEditorReset();codeResetted=new Set;handleCodeUpdatesForProblems()});