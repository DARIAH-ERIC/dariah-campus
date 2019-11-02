# DARIAH-CAMPUS

DARIAH-Campus (D-C) is a combined discovery layer and hosting platform for all
learning resources associated with DARIAH-EU. As a discovery layer, D-C links to
existing, externally hosted, resources (such as #dariahTeach, PARTHENOS etc.);
and as a hosting platform, D-C offers a flexible framework for developing and
sharing web-based training materials, as well as capturing face-to-face events.

D-C materials are hosted and version-controlled in this GitHub repository and
will be delivered to the user as a Gatsby-based overlay website.

**The official launch of DARIAH-CAMPUS is scheduled for November 2019.**

Authors and contributors will be provided with comprehensive author guidelines
on how to port existing or create new content for D-C in Markdown, a lightweight
markup language with plain text formatting syntax. The editorial processes are
still being finalised, but it is anticipated that they will culminate in
post-publication peer review. All resources will receive DOIs and will be
deposited in Zenodo. The overarching aim of D-C is to improve the openness,
discoverability, usability, and long-term sustainability of training resources,
and to achieve best practice in the production and management of open
educational resources in the DARIAH ecosystem.

_Co-funded by the Horizon 2020 innovation and research programme of the European
Union under grant no. 731081._

## GitHub Workflow

### Setting up DARIAH-CAMPUS on your computer

1. Install GitHub Desktop on your computer
2. Open GitHub Desktop
3. Sign in with your GitHub credentials
4. Go to https://github.com/DARIAH-ERIC/dariah-campus and click on fork
5. If you are a contributor to various organizational repositories, GitHub may
   ask you to select where you would like to fork dariah-campus. Make your
   choice.
6. Once the forking finishes, you will be taken to your own personal fork of
   DARIAH-CAMPUS. To make sure you are in the fork, check out the user name in
   the upper left corner.
7. Click on "Clone or download" then select "Open in Desktop"
8. In GitHub Desktop choose where you want to save the cloned dariah-campus fork
   on your computer
9. The first you do this, it may take a couple of minutes, but don't despair,
   this only happens the first time.
10. To get to the folder with DARIAH-CAMPUS click on Open in Atom (or your
    preferred editor, if you already set it up).
11. install Toolbar Markdown Writer
12. click yes on install dependencies

### Atom

- Download and instal Atom
- go to Atom > Preferences (if you are on a Mac) or File > Settings (if you are
  on Windows)
- click on Install
- In the search field, type "mdxjs" and click
- you will see a package called language-mdxjs. Click on install.
- in the search field, type "Markdown Preview Enhanced"
- click install
- one the install finishes, click on Setting
- Click on the settings File extension field, and type a comma after
  `.markdown`, and type `.mdx`

### Contributing to DARIAH-CAMPUS

- do your work
- save changes in atom
- go to GitHub Desktop
- make sure your changes are reflected in the Changes Tab
- write a shore name for the changes you want to submit
- click on "commit to master" (...)
- click on Push origin (this will commit your changes to the remote server, i.e.
  your fork of DARIAH-CAMPUS)
- If you go to your fork on GitHub and click on commits, you will see that your
  changes have been committed to your fork

now you want to submit your changes to DARIAH-CAMPUS editors

-- explain what Fetch origin does, and remind people to fetch origin before
submitting new stuff

- go to Branch > Create Pull Request
- a new window will open in your Browser
- click on the green button "Create pull request"
- click on create pull request

#### First-time contribution

1. **In GitHub Desktop, create a new branch off of master.**  
   Call it by your name, then go watch the movie "Call me by your name" if you
   haven't seen it already.
2. **Do your work.**
3. **Commit your work.**  
   This will save your initial work to _your_ branch _locally_.
4. **Publish your branch.** This will save your intial work to _your_ branch
   _remotely_.
5. **Create a pull request.**  
   This will alert the repository admin person that there are changes that
   should be merged into the master branch, i.e. made public.

#### Subsequent contributions

Before you make your next contribution, you have to make sure that your local
branch is up to date. Remember, you created your special little branch off of
the master at some point, but other people may have contributed to the master in
the meantime. So it's very important that you follow this procedure _every time_
you start doing work on your branch again.

1. **In GitHub Desktop, in your branch, fetch origin.**  
   This will check whether there were any changes made to _your_ branch
   _remotely_.
2. **If GitHub Desktop instructs you to pull origin, pull origin.**  
   This will make sure that _your local_ and _your remote branch_ are in sync.
   Which is important, if you have, for instance, used a different computer to
   commit and publish etc. Or if, God forbid, somebody messed around with your
   branch. They shouldn't. But it did happen at least once. And Toma was to
   blame :)
3. **Branch > Update from master**  
   This will now, in addition, update _your local branch_ with all the
   contributions that have meanwhile been merged into the master from the other
   branches. Remember, each contributor works in their own branch.
4. **If GitHub Desktop instructs you to push origin, push origin.**  
   This will make sure that the changes from the master branch, which you've
   added to _your local_ branch in the previous step, will also make it to _your
   remote branch_. With your local and remote branch fully updated and sync you
   can finally get to do your work.
5. **Do your work.**
6. **Commit your work.**  
   This will save your work to _your_ branch _locally_.
7. **Push origin.**  
   This will save your work to _your_ branch _remotely_.
8. **Create a pull request.**  
   This will alert the repository admin person that there are changes that
   should be merged into the master branch, i.e. made public.
