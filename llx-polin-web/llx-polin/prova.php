<?php
  $packagelist= array();
  $dist="llx16";
  $filelist=array_diff(scandir("data/$dist"), array('..', '.'));
    
  foreach ($filelist as $file){
    $str = file_get_contents("data/$dist/$file");
    $obj= json_decode($str, true);
    var_dump($str);
    $item=new stdClass();
    $item->appname=$obj["appname"];
    $item->filename="$file";
    $item->lastUpdate=$obj["lastUpdate"];
    $item->flavour=$obj["flavour"];
    $item->description=$obj["description"];
    
    $item->lliurexversion=$obj["lliurexversion"];
    $item->upstreamversion=$obj["upstreamversion"];
    $item->watch_me=$obj["watch_me"];
    
    // Get an string formed from versions array
    $translatedVersionsString="";
    
    if (array_key_exists("translatedVersions", $obj)) {
      foreach($obj["translatedVersions"] as $key){
          //echo(var_dump($key)."\n");
          foreach($key as $k=>$pos){
              $translatedVersionsString="$translatedVersionsString $k ";
              //echo $k;//echo(type(json_encode($key))."\n");
          } // foreach
      } // foreach
    } // if
    
    $item->translatedVersions=$translatedVersionsString;
    
    //var_dump($item);

    array_push($packagelist, $item);
}
/*header('Content-type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");*/



//echo(json_encode($packagelist)); 

?>