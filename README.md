Relations Tables :

    Utilisateur -> Historique:
        Un utilisateur peut avoir plusieurs histo ( One to many)
        histori appartient à un utilisateur ( many to One)

    Alerte -> Historique:
        Une alerte peut avoir plusieurs histor (One to many)
        histo appartient à une alerte ( many to one)

    Utilisateur -> Alerte:
        Un utilisateur peut créer plusieurs alertes (One To many)
        Une alerte appartient à un seul utilisateur (Many to one)

    Utilisateur -> Cohorte:( Many to many)
        un uti peut appartenir a plusieres groupe  
        Une cohortes a 0 a n membres  

    Utilisateur -> blacklist:( Many to many)
        un uti peut etre black list par different superviseur( = +ieres listes) (One to Many)
        Une  entre dans blacklist appartient a un utilisa  ( many to one1)