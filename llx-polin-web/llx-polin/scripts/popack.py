#! /usr/bin/python

import subprocess
import sys
import os, json
from distutils.version import LooseVersion, StrictVersion
from pprint import pprint


lliurexNet="http://lliurex.net/xenial"
ubuntu="http://es.archive.ubuntu.com/ubuntu xenial"

dist="llx16"
ppath="./../data/"+dist+"/";

# Remember a apt-get update first...

#if len(sys.argv)!=2:
#    print "Usage: popack.py package"

def getPackageVersion(package, source):
    '''
    Returns major version in apt cache from an specific source
    '''
    
    try:
        versions=subprocess.Popen('apt-cache madison '+package+' | grep "'+source+'" | cut -d "|" -f 2', shell=True,stdout=subprocess.PIPE).communicate()[0].replace(" ", "").splitlines();
        majorVersion="0";
        for ver in versions:
            if LooseVersion(majorVersion) < LooseVersion(ver):
                majorVersion=ver;
        if majorVersion=="0":
            return ""
        return majorVersion
    except Exception as e:
        return ""


def readPackages():
    for file in os.listdir(ppath):
        if file.endswith(".json"):
            
            needs_to_rewrite=False
            
            print "\nParsing "+file+"...";
            
            try:            
                with open(ppath+file) as data_file:
                    pkginfo = json.load(data_file)
                    ##pprint (data)
                    if (pkginfo['metapackage']!="" and pkginfo['metapackage']!="undefined"):
                        
                        #print("    App: "+pkginfo['appname'])
                        #print("    Metapackage: "+pkginfo['metapackage'])                        
                        #print("    Current LliureX Version:"+pkginfo['lliurexversion'])
                        
                        # Getting lliurex mirror version
                        mirrorllxvers=getPackageVersion(pkginfo['metapackage'], lliurexNet)
                        #print("    Current Version in LliureX Repository:"+mirrorllxvers)
                        
                        if (pkginfo['lliurexversion']!="" and mirrorllxvers!="" and (LooseVersion(pkginfo['lliurexversion']) < LooseVersion(mirrorllxvers))):
                            #print ("        *** Needs update");
                            print ("    Updating main package in LliureX for "+pkginfo['appname']+"("+pkginfo['metapackage']+") from version "+pkginfo['lliurexversion']+" to "+mirrorllxvers);
                            pkginfo['lliurexversion']=mirrorllxvers;
                            needs_to_rewrite=True
                        
                        #print("    Current Upstream Version:"+pkginfo['upstreamversion'])
                        # Getting ubuntu mirror version
                        mirrorubuntuvers=getPackageVersion(pkginfo['metapackage'], ubuntu)
                        #print("    Current Version in Ubuntu Repository:"+mirrorubuntuvers)
                        if (pkginfo['upstreamversion']!="" and mirrorubuntuvers!="" and (LooseVersion(pkginfo['upstreamversion']) < LooseVersion(mirrorubuntuvers))):
                            #print ("        *** Needs update");
                            print ("    Updating main package in Ubuntu for "+pkginfo['appname']+"("+pkginfo['matapackage']+") from version "+pkginfo['upstreamversion']+" to "+mirrorubuntuvers+". Check Upstream version!");
                            pkginfo['upstreamversion']=mirrorubuntuvers;
                            needs_to_rewrite=True
                    
                    
                        # Cal actualitzar la llista de metapaquets
                        # To Do
                        
                    if (len(pkginfo["packages"])>0):
                        for pkg in pkginfo["packages"]: # pkg is a dict
                            if isinstance(pkg,dict):
                                for pkgname in pkg:
                                    llxversion=getPackageVersion(pkgname, lliurexNet)
                                    if LooseVersion(pkg[pkgname]) < LooseVersion(llxversion):
                                        print "    "+pkgname + "("+pkg[pkgname]+") needs update to " + "("+llxversion+")"
                                        pkg[pkgname]=llxversion
                                        needs_to_rewrite=True
                                    #print pkgname + pkg[pkgname]
    
            except Exception as e:
                print ("CAUTION!! Error parsing file "+file);
                print (e)
                                
                            
            
            if(needs_to_rewrite==True):
                print ("Rewriting: "+ppath+file);
                #pprint(pkginfo)
                with open(ppath+file+".new", 'w') as outfile:
                    json.dump(pkginfo, outfile)
            


readPackages()

'''


v=getPackageVersion(sys.argv[1], lliurexNet);
print "Major LliureX:"
print v;

print "Major Ubuntu"
v=getPackageVersion(sys.argv[1], ubuntu);
print v;
'''
#In [2]: LooseVersion("2.3.1") < LooseVersion("10.1.2")

