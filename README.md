Anthropologie.eu
=============

Remote repositroy for templates and certain resources behind Anthropologie's european website. All development work to be controlled and centrally stored here.

UAT - <http://anthropologie.uat.venda.com>
Live - <http://www.anthropologie.eu>

Development tasks split out in pivotal tracker project, work from the top down on outstanding issues assigned to you

[Pivotal Tracker Project](https://www.pivotaltracker.com/projects/616053 "Anthropologie Pivotal Tracker Project")

Top level directories
------------

* resources
	* js
	* css
	* fonts
* templates
	* subdirectories for all available templates
	
Note that we have ignored current images, flash and other large files in our commits. We will add in new images were applicable.

Guidelines
------------

- Install git-ftp, this will be used to manage the upload process over ftp, default to UAT and add a scope for Live. Some bespoke configuration needed to place hash in a write access location.
- Fetch from remote often to avoid conflicts with other works and merge, push for a new commit.
- Follow the workflow found here <http://reinh.com/blog/2009/03/02/a-git-workflow-for-agile-teams.html> and append story id to the beginning of main commits i.e. "[#1234] Site redesigned" to automatically comment in tracker on push to this repository.