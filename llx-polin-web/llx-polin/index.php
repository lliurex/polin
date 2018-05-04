<html>
<head>
	<title>LliureX Translations Manager</title>
     <!--link rel="icon" href="icons/default.png"-->
     <meta content="text/html; charset=UTF-8" http-equiv="content-type">
     
	<link rel="stylesheet" href="lib/bootstrap-3.3.7/css/bootstrap.min.css">
	<!--link rel="stylesheet" href="lib/bootstrap-3.3.7/css/bootstrap-theme.css"-->
	<link rel="stylesheet" href="lib/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="lib/DataTables-1.10.13/media/css/jquery.dataTables.min.css">
    <link rel="stylesheet" type="text/css"  href="css/index.css">
    
    
    
	<!--jquery -->
	<script type="text/javascript" src="lib/jquery-3.1.1.min.js"></script>
    <!-- datatables -->
    <script type="text/javascript" charset="utf8" src="lib//DataTables-1.10.13/media/js/jquery.dataTables.js"></script>
	
	<!-- bootstrap js -->
	<script type="text/javascript" src="lib/bootstrap-3.3.7/js/bootstrap.min.js"></script>
	
	<!-- bootbox -->
	<script type="text/javascript" src="lib/bootbox.min.js"></script>
	
	<!-- Form Factory -->
	<script type="text/javascript" src="lib/formFactory.js"></script>
    
    <script type="text/javascript" src="js/index.js"></script>
</head>
<body>

<nav class="navbar navbar-default polinHeader">
  <div class="container-fluid" style="float: right">
    <!--div class="navbar-header">
    </div-->
	<button id="addTranslation" type="button" class="btn btn-primary btn-circle btn-lg"><i class="glyphicon glyphicon glyphicon-file"></i></button>
	<button id="downloadConfig" type="button" class="btn btn-primary btn-circle btn-lg"><i class="glyphicon glyphicon-cloud-download"></i></button>
	<button id="uploadConfig" type="button" class="btn btn-primary btn-circle btn-lg"><i class="glyphicon glyphicon-cloud-upload"></i></button>
	<!--input type="file" name="fileToUpload" id="fileToUpload" style="display:none"></input-->
	
	<form action="controller.php" method="post" enctype="multipart/form-data" style="display:none">
    <input type="hidden" name="action" value="uploadFile" />
	<input type="hidden" name="dist" value="" id="dist"/>
    <input type="file" name="fileToUpload" id="fileToUpload" />
    <input id="submitForm" type="submit" value="Extract Zip" name="submit" />
</form>
	
	
  </div>

</nav>



<div id="messages"></div>
<div id="packageTableContainer">
</div>

</body>
</html>