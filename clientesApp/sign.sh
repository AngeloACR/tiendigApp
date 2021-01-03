#!/bin/bash

keystoreName="/home/angeloacr/Proyectos/tiendig/keystores/tiendig.keystore"
path="./platforms/android/app/build/outputs/apk/release/"
appName1=app-release-unsigned.apk
appName2=tiendig.apk
alias=tiendig
cd $path
rm $appName2
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $keystoreName $appName1 $alias

zipalign -v 4 $appName1 $appName2