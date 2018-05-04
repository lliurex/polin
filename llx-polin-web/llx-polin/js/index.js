
function polinPacMan(){
    this.packageList={};
    this.defaultDist="llx16";
    this.formFactory=new formFactory();
}

polinPacMan.prototype.getPackageList = function getPackageList(){
    var self=this;
    $.ajax({
        type: 'POST',
        url: "controller.php",
        data: {action:"getPackageList", dist:self.defaultDist},
        async:false,
        success: function(ret){
            self.packageList=ret;
        }
    });
    
    
}

polinPacMan.prototype.drawPackageList = function drawPackageList(){
    var self=this;
    //alert(self.packageList);
    
    var table=$(document.createElement("table")).attr("id", "packageTable").attr("class","display").attr("cellspacing", "0").attr("width", "100%");
    var tbody=$(document.createElement("tbody"));
    
    // Build header row and footer
    var cols=["Aplicació", "Sabor", "Ultima Act.","Req. At.", "Descripció", "Vers. LliureX", "Vers. Upstrem", "Vers. Trad."];
    
    var row=$(document.createElement("tr"));
    for (i in cols){
        var th=$(document.createElement("th")).html(cols[i]).css("text-align", "center");
        $(row).append(th);
    }
    
    var thead=$(document.createElement("thead")).append(row);
    var tfoot=thead;
    
    $(table).append(thead).append(tfoot);
    // End build row
    
    
    for (var i in self.packageList){
        // Build row
        cols=[self.packageList[i].appname,self.packageList[i].flavour, self.packageList[i].lastUpdate, self.packageList[i].watch_me, self.packageList[i].description, self.packageList[i].lliurexversion, self.packageList[i].upstreamversion, self.packageList[i].translatedVersions];
        
        var row=$(document.createElement("tr"));
        for (col in cols){
            var td=$(document.createElement("td")).html(cols[col]);
            
            
            if(col==="5") {
                console.log("compare: *"+cols[5]+"* amb *"+cols[7].split(" ").join("")+"*");
                console.log(cols[5]>cols[7]);
            }
            
            if(col==="5" && cols[5]!==cols[6]) $(row).addClass("updateable");
                            
            if(col==="5" && cols[5]>cols[7].split(" ").join("")) $(row).addClass("updateableTrans");
                            
            if(col==="0") $(td).addClass("poLink").attr("filename", self.packageList[i].filename);
            if(col==="3")
                if (self.packageList[i].watch_me=="true") $(td).html('<span class="glyphicon glyphicon-ok"></span>').css("text-align", "center");
                else $(td).html('');
            $(row).append(td);
        }
        console.log(self.packageList[i]);
        $(row).attr("filename", self.packageList[i].filename);
        $(tbody).append(row);
        // End build row
        
        $(table).append(tbody);
        
    }
    
    $("#packageTableContainer").append(table);    
    $('#packageTable').DataTable({
         ordering: true
        });
}


polinPacMan.prototype.setEventListeners = function setEventListeners(){
    var self=this;
    
    //$(".poLink").on("click", function(){

	$("#packageTable tbody").off("click");
    $("#packageTable tbody").on("click", "tr", function(){
        var filename=$(this).attr("filename");
        // Load data from package, then show dialog
        
        $.ajax({
        type: 'POST',
        url: "controller.php",
        data: {action:"getPackageInfo", dist:self.defaultDist, package: filename},
        async:false,
        success: function(ret){
          self.showConfigDialog(ret, filename, self.defaultDist);  
        }
        });
    });
    
    
	$("#addTranslation").off("click");
    $("#addTranslation").on("click", function(){
            self.addNewApp();
        });

    $("#downloadConfig").off("click");

    $("#downloadConfig").on("click", function(){
        $.ajax({
            type: 'POST',
            url: "controller.php",
            data: {action:"downloadCurrentInfo", dist:self.defaultDist},
            async:true,
            success: function(ret){
                 if(ret) {
                 location.href = ret;
                }
            }
        });
        
    });
    

	$("#uploadConfig").off("click");
    $("#uploadConfig").on("click", function(){
        $("#fileToUpload").click();
        //$("#submitForm").click();
    });
    
    $("#fileToUpload").change(function(){
        $("#dist").attr("value", self.defaultDist);
        $("#submitForm").click();
        location.reload();
        
    });
    
    
    
    
    
    
}


polinPacMan.prototype.addNewApp = function addNewApp (){
    var self=this;
    var pkgInfo={
        "appname":"",
        "packages":[],
        "lastUpdate":"",
        "flavour":"",
        "description":"",
        "lliurexversion":"",
        "upstreamversion":"","upstreamUrl":"",
        "translateUrl":"",
        "translatedVersions":[],
        "svnPath":"",
        "transType":"properties",
        "translationMethod":"",
        "installPath":"",
        "fileList":[],
        "recipe":"",
        "notes":"",
        "metapackage":"",
        "watch_me":""};
        
    var filename=prompt("Indica el nom de l'aplicació");
    var defaultDist=self.defaultDist;
    
    if (filename) self.showConfigDialog(pkgInfo, filename+".json", defaultDist);
    
}



polinPacMan.prototype.showConfigDialog = function showConfigDialog(pkgInfo, filename, defaultDist){
    var self=this;
    var content="";
    console.log(pkgInfo);
    console.log(filename);
    console.log(defaultDist);
    
    var checkArray=["appname", "packages", "lastUpdate", "flavour", "description", "lliurexversion", "upstreamversion", "upstreamUrl","translateUrl","translatedVersions","svnPath","transType","translationMethod","installPath", "fileList","recipe","notes"];
    for (item in checkArray){
        if (pkgInfo[checkArray[item]]===undefined) pkgInfo[checkArray[item]]="";
    }
    
    /*  App Name */
    content+=self.formFactory.createText({"id":"appname",
                                        "label": "Nom de l'aplicació",
                                        "help":"Nom de l'aplicació (no necessàriament del paquet)",
                                        "value":pkgInfo.appname}, 2);
    
    /*  Flavour */
    content+=self.formFactory.createText({"id":"flavour",
                                        "label": "Sabor",
                                        "help":"Sabor de LliureX on es troba l'aplicació, o bé si és una aplicació d'us comú",
                                        "value":pkgInfo.flavour}, 2);
    
    /*  Description */
    content+=self.formFactory.createText({"id":"description",
                                        "label": "Descripció",
                                        "help":"Descripció de l'aplicació",
                                        "value":pkgInfo.description},2);
    
    /* last update */
    content+=self.formFactory.createText({"id":"lastUpdate",
                                        "label": "Última actualització",
                                        "help":"Data de la última actualització",
                                        "value":pkgInfo.lastUpdate}, 4);
    /* Requires attention (watch me)*/
    
    var req="";
    if (pkgInfo.watch_me=="true") req="checked";
    content+=self.formFactory.createCheckbox({"id":"watch_me",
                                        "label": "Req. Atenció",
                                        "default":req,
                                        "help":"Indica si la traducció requereix d'alguna atenció especial (reviseu anotacions)"}, 4);
    
    
    /* Versions */
    
    content+=self.formFactory.createText({"id":"lliurexVersion",
                                        "label": "Versió LliureX",
                                        "help":"Versió disponible als repositoris de LliureX",
                                        "value":pkgInfo.lliurexversion},3);
    
    content+=self.formFactory.createText({"id":"upstreamVersion",
                                        "label": "Versió Upstream",
                                        "help":"Versió disponible als repositoris del mantenidor",
                                        "value":pkgInfo.upstreamversion},3);
    
    /* Paquet base (meta) */
    
    content+=self.formFactory.createText({"id":"metapackage",
                                        "label": "Paquet Base",
                                        "help":"Metapaquet o paquet de l'aplicació",
                                        "value":pkgInfo.metapackage},3);

    
    /* Create package list */
    var pkglist="";
    
    for (pkg in pkgInfo.packages){
        var pkgname=Object.keys(pkgInfo.packages[pkg])[0];
        console.log(pkgname);
        var version=pkgInfo.packages[pkg][pkgname];
        if (pkgname==="") continue;
        pkglist+=pkgname+"("+version+"), ";
    }
    // Remove ", " at end
    pkglist=pkglist.substring(0,pkglist.length-2);
    
    content+=self.formFactory.createTextArea({"id":"packagelist",
                                        "label": "Paquets",
                                        "help": "Llista de paquets que componen l'aplicació",
                                        "value":pkglist},2);
    
    
    /* Traslated Versions */
    var versions="";
    for (ver in pkgInfo.translatedVersions){
        var version=Object.keys(pkgInfo.translatedVersions[ver])[0];
        var date=pkgInfo.translatedVersions[ver][version];
        if (version==="") continue;
        versions+=version+"("+date+"), ";
    }
    // Remove ", " at end
    versions=versions.substring(0,versions.length-2);
    
    content+=self.formFactory.createTextArea({"id":"translatedVersions",
                                        "label": "Versions Traduïdes",
                                        "help": "Llista versions amb la data de la última traducció",
                                        "value":versions},2);
    
    /* URLS */
    content+=self.formFactory.createText({"id":"upstreamURL",
                                        "label": "Adreça d'Upstream",
                                        "help":"Adreça web de l'aplicació al lloc del mantenidor",
                                        "value":pkgInfo.upstreamUrl},3);
    
    content+=self.formFactory.createText({"id":"TranslateURL",
                                        "label": "Lloc de traducció",
                                        "help":"Lloc on s'ubiquen les traduccions (generalment d'upstream)",
                                        "value":pkgInfo.translateUrl},3);
    
    content+=self.formFactory.createText({"id":"svnPath",
                                        "label": "Ruta Subversion",
                                        "help":"Ruta de la carpeta de traduccions al subversion de traduccions",
                                        "value":pkgInfo.svnPath},3);
    
    
    
    /*Traslation type*/
     content+=self.formFactory.createSelect({"id":"translationType",
                               "label":"Sistema de traducció",
                               "help":"Sistema de traducció utilitzat al paquet",
                               "default":pkgInfo.transType,
                               "options":[
                                {"value":"po", "label":"Fitxers po"},
                                {"value":"ts", "label":"Fitxers ts"},
                                {"value":"javascript", "label": "Fitxers Javascript"},
                                {"value":"properties", "label": "Fitxers de properties"},
                                {"value":"other", "label": "Altres mecanismes"}]},2);
     
     /*Traslation Method*/
     content+=self.formFactory.createSelect({"id":"translationMethod",
                               "label":"Mecanisme de traducció",
                               "help":"Mecanisme emprat per a situar el paquet al sistema",
                               "default":pkgInfo.translationMethod,
                               "options":[
                                {"value":"tradInApp", "label":"L'aplicació porta els seus fitxers de traducció"},
                                {"value":"langPack", "label": "Les traduccions van en un paquet a banda"},
                                {"value":"applicationEmbed", "label":"La traducció és encastada a l'aplicació"},
                                {"value":"other", "label": "Altres mecanismes"}]},2);

    /* install Path */
    content+=self.formFactory.createText({"id":"installPath",
                                        "label": "Directori d'instal·lació",
                                        "help":"Ruta al sistema on s'instal·len les traduccions",
                                        "value":pkgInfo.installPath},2);
    
    
    
    
    /* File List*/
    var filelist="";
    for (var i in pkgInfo.fileList){
        var file=pkgInfo.fileList[i];
        filelist=filelist+file+", ";
    }
    // Remove ", " at end
    filelist=filelist.substring(0,filelist.length-2);
    
    content+=self.formFactory.createTextArea({"id":"fileList",
                                        "label": "Llista de fitxers",
                                        "help": "Llista de fitxers corresponents a la traducció",
                                        "value":filelist},2);
    
    content+=self.formFactory.createTextArea({"id":"recipe",
                                        "label": "Detall de traducció",
                                        "help": "Guía d'ajuda sobre la traducció de l'aplicació",
                                        "value":pkgInfo.recipe},2);
    
    content+=self.formFactory.createTextArea({"id":"notes",
                                        "label": "Anotacions",
                                        "help": "Detalls o particularitats de l'aplicació",
                                        "value":pkgInfo.notes},2);
    
    
    
    
    var dialog = bootbox.dialog({
        size: "large",
        title: "Informació de l'aplicació "+pkgInfo.appname,
        message: content,
        /*closeButton: true,*/
        buttons:{
            "save":{
                label: "Guarda",
                className: "btn-success",
                callback: function(){
		    // TO-DO
		    // we needs to clean pkgInfo.appname
                    self.savePkgInfo(filename, defaultDist);
                }
            },
            "exit":{
                label: "Tanca",
                className: "btn-default"                
            }
        }
    });
    
    $(".modal-content").addClass("container col-md-12");
    $(".modal-body").addClass("container-fluid");
    
    dialog.modal('show');
    $(".modal-dialog.modal-lg").css("width", "90%");
}

polinPacMan.prototype.savePkgInfo = function savePkgInfo(filename, dist){
    var self=this;
    
    // Getting simple values
    
    var appname=$("#appname").val();
    var flavour=$("#flavour").val();
    var description=$("#description").val();
    var lastUpdate=$("#lastUpdate").val();
    var lliurexVersion=$("#lliurexVersion").val();
    var upstreamVersion=$("#upstreamVersion").val();
    var upstreamURL=$("#upstreamURL").val();
    var TranslateURL=$("#TranslateURL").val();
    var svnPath =$("#svnPath").val();
    var translationType=$("#translationType").val();
    var translationMethod=$("#translationMethod").val();
    var installPath=$("#installPath").val();
    var recipe=$("#recipe").val();
    var notes=$("#notes").val();
    var metapackage=$("#metapackage").val();
    var watch_me=$("#watch_me").prop("checked").toString();
    
    
    // Setting package list in proper format
    var packagelist=($("#packagelist").val()).replace(" ", "").split(",");
    var packlist=[];
    for (pkg in packagelist){
        var keyval=packagelist[pkg].replace(")", "").split("(");
        var key=keyval[0];
        var val=keyval[1];
        var obj={};
        if (val===undefined) val="";
        obj[key]=val; 
        packlist.push(obj);
    }
    
    // Setting file list
    var fileList=($("#fileList").val()).replace(" ", "").split(",");
     
    // Setting traslated versions
    var translatedVersions=($("#translatedVersions").val()).replace(" ", "").split(",");
    var tlist=[];
    for (pkg in translatedVersions){
        var keyval=translatedVersions[pkg].replace(")", "").split("(");
        var key=keyval[0];
        var val=keyval[1];
        var obj={};
        if (val===undefined) val="";
        obj[key]=val; 
        tlist.push(obj);
    }
    
    var item={
    "appname":appname,
    "packages": packlist,
    "lastUpdate":lastUpdate,
    "flavour":flavour,
    "description": description,
    "lliurexversion": lliurexVersion,
    "upstreamversion": upstreamVersion,
    "upstreamUrl": upstreamURL,
    "translateUrl":TranslateURL,
    "translatedVersions": tlist,
    "svnPath":svnPath,
    "transType":translationType,
    "translationMethod":translationMethod,
    "installPath":installPath,
    "fileList":fileList,
    "recipe":recipe,
    "notes":notes,
    "metapackage":metapackage,
    "watch_me":watch_me
    };
    
    // Perform call to php
    
    
    var data={action:"savePackage", dist: dist, filename: filename, pkg:item};
    console.log(data);
    $.ajax({
        type: 'POST',
        url: "controller.php",
        data: data,
        async:false,
        success: function(ret){
            if(ret.status){
                $("#packageTableContainer").empty();
                $("#messages").empty();
                var item=$(document.createElement("div")).addClass("successmsg").html("El fitxer "+dist+"/"+filename+" s'ha guardat correctament.");
                $("#messages").append(item);
                $(".successmsg").fadeIn(1000, function(){
                    window.setTimeout(function(){
                        $(".successmsg").fadeOut(1000);
                        }, 3000);
                    
                    });
                self.getPackageList();
                self.drawPackageList();
                self.setEventListeners();
                
                }
            
            //alert(typeof((JSON.stringify(ret))));
            //alert (JSON.parse(JSON.stringify(ret))[0]);
            //
            
            //ret=JSON.parse(ret);
            //alert(ret.status);
            //if (ret.status=="true") alert("is true");
            
            //
        }
    });
    
}



$(document).ready(function() {
    var polin=new polinPacMan();
    polin.getPackageList();
    polin.drawPackageList();
    polin.setEventListeners();
    
});




