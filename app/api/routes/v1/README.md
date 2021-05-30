# terminology
  - router: there is a single application router *appRouter*
  - controllers: *controllers* take an *appRouter* group and map paths to *handlers*
  - handlers: *appRouter* middleware functions containing URI specific business logic


# spkgcheck: tale dependency checker
  - product api card
    - name: **pkgcheck*: package dependency analyzer
    - description: [see openapi description](./v1openapi.yaml)
    - pain points
      - cumbersome
      - hella fkn steps to do manually
      - time sink
        - especially for JS engineers when there are 1000 apps that do 90% the same shit

    - potential & viability
      - rudimentary proxy for understanding FOSS apps maintainence
      - one factor of **MANY** that you should consider, but many times the first and only used

  - service landscape
    - hopefully npm has a dev API we can use for this
    - github has a dev API
    - [unpkg might be the easiest](https://unpkg.com/)

  - data landscape
    - npm
    - yarn has it own thing too
    - github, gitlab, etc
    -

  - user journey
    - I need a TOOL that does X
    - search NPM based on keyword or whatever the fk
    - get a list of matching packages, and for each
      - go to its github page
      - review information
        - when was it last updated?
        - what are its dependencies?
          - installed version, vs available version
            - available version requires finding its NPM/github page
          - are dependencies direct / peer dependencies ?
      - repeat for each dependency in consideration set
        - which one is best maintaned?
          - shit do technically know? or do you depend on intuition and judgment
          - do you have time to technically figure that shit out?
            - I mean for EVERY fucking thing?
            - be real bro

  - prototype
    - [see openapi description](./v1openapi.yaml)

# lob API
  - [openapi v3](https://github.com/lob/lob-openapi)
  - [dashboard](https://dashboard.lob.com/#)
  - [guides](https://www.lob.com/guides)
  - [api reference](https://docs.lob.com/)
