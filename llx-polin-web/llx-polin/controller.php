<?php
if(!session_id()) session_start();

$action=$_POST["action"];
//$action=$_GET["action"];

switch ($action) {
  case 'getPackageList':
    getPackageList($_POST["dist"]);
    break;
  case 'getPackageInfo':
    getPackageInfo($_POST["dist"], $_POST["package"]);
    //getPackageInfo($_GET["dist"], $_GET["package"]);
    break;
  
  case 'savePackage':
    savePackage($_POST["dist"], $_POST["filename"],$_POST["pkg"]);
    break;
  
  case 'downloadCurrentInfo':
    downloadCurrentInfo($_POST["dist"]);
    break;
    
  case 'uploadFile':
    uploadFile($_POST["dist"]);
    break;
    
  
  default:
    echo("Error 42. This is not the page you are looking for.");
    break;
}


function uploadFile($dist){
  header('Content-type: application/json');
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");
  
  $ret=new stdClass();
      
  
  if($_FILES["fileToUpload"]["name"]) {
    $file = $_FILES["fileToUpload"];
    $filename = $file["name"];
    $tmp_name = $file["tmp_name"];
    $type = $file["type"];
      
    $name = explode(".", $filename);
    $accepted_types = array('application/zip', 'application/x-zip-compressed', 'multipart/x-zip', 'application/x-compressed');
  
    if(in_array($type,$accepted_types)) { //If it is Zipped/compressed File
        $okay = true;
    } 
      
    $continue = strtolower($name[1]) == 'zip' ? true : false; //Checking the file Extension
  
    if(!$continue) {
        
        $res->status=false;
        $res->msg="No esteu pujant un fitxer zip!";        
    }
    
    /* here it is really happening */
    $ran = $name[0]."-".time()."-".rand(1,time());
    //$targetdir = "uploads/".$ran;
    $targetdir = "data/".$dist;
    $targetzip = "uploads/".$ran.".zip";
  
    if(move_uploaded_file($tmp_name, $targetzip)) { //Uploading the Zip File
          
        /* Extracting Zip File */
  
        $zip = new ZipArchive();
        $x = $zip->open($targetzip);  // open the zip file to extract
        if ($x === true) {
            $zip->extractTo($targetdir); // place in the directory with same name  
            $zip->close();
      
            unlink($targetzip); //Deleting the Zipped file
            
        }
        
        $res->status=true;
        $res->msg="El fitxer s'ha pujat correctament";
        
  
    } else {    
        $res->status=false;
        $res->msg="Hi ha problemes amb la càrrega del fitxer";
    }
}
echo($res);
    
  
}


function downloadCurrentInfo($vers){

    $dir = 'data/'.$vers;
    $zip_file = 'workdir/infoPos.zip';
    
    // Get real path for our folder
    $rootPath = realpath($dir);
    
    // Initialize archive object
    $zip = new ZipArchive();
    $zip->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE);
    
    // Create recursive directory iterator
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($rootPath),
        RecursiveIteratorIterator::LEAVES_ONLY
    );
    
    foreach ($files as $name => $file)
    {
        // Skip directories (they would be added automatically)
        if (!$file->isDir())
        {
            // Get real and relative path for current file
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($rootPath) + 1);
    
            // Add current file to archive
            $zip->addFile($filePath, $relativePath);
        }
    }
    
    // Zip archive will be created only after closing object
    $zip->close();
    
    //$zipFile = 'http://youraddress.com/downloads/'.$zipFile;
    //echo json_encode(array('zip' => $zipFile));
    echo($zip_file);
    
    /*header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.basename($zip_file));
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($zip_file));
    
    //readfile($zip_file);*/
    
    
    
  
}


function getPackageList($dist){
    
  $packagelist= array();
  $filelist=array_diff(scandir("data/$dist"), array('..', '.'));
    
  foreach ($filelist as $file){
    $str = file_get_contents("data/$dist/$file");
    $obj= json_decode($str, true);
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
    
    
    array_push($packagelist, $item);
    
    }
    
    
  header('Content-type: application/json');
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");
  
  
  
  echo(json_encode($packagelist));

}



function getPackageInfo($dist, $package){
  
    //echo("data/$dist/$package\n");
    try{
      $file = file_get_contents("data/$dist/$package");
      
      $obj= json_decode($file, true);
      
      header('Content-type: application/json');
      header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
      header("Cache-Control: post-check=0, pre-check=0", false);
      header("Pragma: no-cache");
      
    echo(json_encode($obj));
    
    } catch(Exception $e){
      echo("Exception: ".$e->getMessage());
      };
    
}

function savePackage($dist, $filename , $pkg){
  $item="$dist \n $filename \n $pkg";
  
  
  header('Content-type: application/json');
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");
  
  $res=new stdClass();
  
  //echo(json_encode($item));
  
  try{
    $fd=fopen("data/$dist/$filename", "w");
    if ($fd==false) {
        $res->status=false;
        $res->msg="Permisson denied";
        echo($res);
        return -1;
      };
    
    fwrite($fd, json_encode($pkg, JSON_PRETTY_PRINT));
    fclose($fd);
    
    $res->status=true;
    echo (json_encode($res));
  } catch (Exception $e){
    $res->status=false;
    $res->msg=$e;
    echo(json_encode($res));
  }
  
  
  
}



?>