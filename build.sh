#!/bin/sh
cd ../
mkdir output
# cp -R ./Algorithm-Roadmap-Site-FE/* ./output
\cp -Rf $(ls -a ./Algorithm-Roadmap-Site-FE/ | grep -Ev "^.github$|^.$|^..$") ../output
cp -R ./output ./Algorithm-Roadmap-Site-FE/