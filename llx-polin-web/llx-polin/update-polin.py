#!/usr/bin/python

import sys
import apt
import json
from os import walk

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

cache=apt.Cache()

# Reading arguments
if (len(sys.argv)==2):
    filename="./data/"+sys.argv[1]+".info"
elif (len(sys.argv)==1):
    filename="./data/llx16.info"
else:
    print "\n\nUsage: update-polin.py [distro]\n\n"
    exit()


# Readinf info file
try:
    with open(filename) as json_data:
            info=json.load(json_data)
except Exception as e:
    print "\n\nError: Unkown distro\n\n"
    exit()


def getVersions(pkgname):
    try:
        pkg=cache[pkgname]
        
        for i in range(0,len(pkg.versions)):
            print "\nVersion:"+pkg.versions[i].version
            print "site:"+pkg.versions[i].origins[0].site
            print "codename:"+pkg.versions[i].origins[0].codename
            print "component:"+pkg.versions[i].origins[0].component
            print "label:"+pkg.versions[i].origins[0].label
            print "origin:"+pkg.versions[i].origins[0].origin
    
    except Exception as e:
        return -1
   

def checkVersions(pkgname, lliurexversion, site, codename, pkgdata):
    try:
        if (cache.has_key(pkgname) or cache.has_key(pkgdata['metapackage'])):
            if (cache.has_key(pkgname)):
                pkg=cache[pkgname]
            else:
                pkg=cache[pkgdata['metapackage']]
                pkgname=pkgname+"("+pkgdata['metapackage']+")";
        
            for i in range(0,len(pkg.versions)):
                if (site==pkg.versions[i].origins[0].site and codename==pkg.versions[i].origins[0].codename):
                    if (lliurexversion!=pkg.versions[i].version):
                        pkgname=pkgname[0:34]
                        lliurexversion=lliurexversion[0:24]
                        pkg_vers=pkg.versions[i].version[0:24]
                        if (lliurexversion>pkg_vers):
                            updateable=bcolors.OKBLUE+bcolors.BOLD+"Higher Translated"+bcolors.ENDC
                        else:
                            updateable=bcolors.FAIL+bcolors.BOLD+"Newer Version"+bcolors.ENDC
                        print ((bcolors.BOLD+"{:<35s} {:<25s} {:<25s} {:<25s} "+(bcolors.ENDC)).format(pkgname, lliurexversion, pkg_vers, updateable))
    
                    else:
                        print ("{:<35s} {:<25s} {:<25s}".format(pkgname[0:24], lliurexversion[0:24], pkg.versions[i].version[0:24]))


    # Uncomment to see package details
    #    for item in pkgdata['packages']:
    #       for i in item.keys():
    #           print ((bcolors.HEADER+"{:<25s}"+(bcolors.ENDC)).format("\t"+i+"("+item[i]+")"))
    #    
            
    except Exception as e:
        print str(e)
        return -1
   

# Setting distro info
basepath="./data/"+info["path"]+"/"
default_site=info["default_site"]
codename=info["codename"]


# Reading files
_, _, filenames = next(walk(basepath), (None, None, []))
 
print "\nChecking versions...\n";

print ((bcolors.UNDERLINE+bcolors.BOLD+"{:<35s} {:<25s} {:<25s} {:<25s}"+bcolors.ENDC).format("Package", "Current Version", "Repo Version", "Updateable"))
for filename in filenames:
    with open(basepath+filename) as json_data:
        d=json.load(json_data);
        #print "\n\n***"+filename+': '+d['appname']
        #getVersions(d['appname'])
        checkVersions(d['appname'], d['lliurexversion'],default_site, codename, d)
    


    

'''
if (len(sys.argv)==2):
    pkgname=sys.argv[1];
else:
    pkgname='xfce4-whiskermenu-plugin';

pkg=cache[pkgname]

print "packege:"+pkgname

for i in range(0,len(pkg.versions)):
    print "\nVersion:"+pkg.versions[i].version
    print "site:"+pkg.versions[i].origins[0].site
    print "codename:"+pkg.versions[i].origins[0].codename
    print "component:"+pkg.versions[i].origins[0].component
    print "label:"+pkg.versions[i].origins[0].label
    print "origin:"+pkg.versions[i].origins[0].origin
''' 

