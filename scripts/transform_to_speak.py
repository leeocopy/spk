import re

def transform_it(html):
    # 1. Meta & Title
    html = html.replace(
        '<title>Siti web a Reggio Emilia | Davide Carusio Web Designer</title>',
        '<title>SPEAK | Corporate English, Workshops & Executive Coaching</title>'
    )
    html = html.replace(
        'content="Web designer freelance a Reggio Emilia. Siti su Webflow e WordPress, per agenzie, brand e professionisti. Richiedi un preventivo gratuito."',
        'content="Speak développe la communication professionnelle en anglais pour les dirigeants, professionnels et équipes. Coaching individuel, workshops et événements corporate."'
    )
    html = html.replace(
        'content="Siti web a Reggio Emilia | Davide Carusio Web Designer"',
        'content="SPEAK | Corporate English, Workshops & Executive Coaching"'
    )
    html = html.replace(
        'Davide Carusio | Web Designer',
        'SPEAK | Corporate English'
    )
    html = html.replace(
        'Web designer freelance a Reggio Emilia. Siti su Webflow e WordPress, veloci e curati, per agenzie, brand e professionisti.',
        'Speak développe la communication professionnelle en anglais pour les dirigeants, professionnels et équipes. Coaching individuel, workshops et événements.'
    )

    # 2. Loader Texts
    html = html.replace(
        '<span data-load-text="" data-load-reset="" class="loader__text-el">ricorda</span><span data-load-text="" data-load-reset="" class="loader__text-el">la pizza migliore è la margherita</span>',
        '<span data-load-text="" data-load-reset="" class="loader__text-el">SPEAK</span><span data-load-text="" data-load-reset="" class="loader__text-el">ENGLISH HAPPENS</span>'
    )

    # 3. Cursor
    html = html.replace(
        '<span class="cursor-bubble__text">Visita il sito</span>',
        '<span class="cursor-bubble__text">Découvrir</span>'
    )

    # 4. Nav Logo & Links
    html = html.replace(
        '<div class="nav-logo-text">davide carusio</div>',
        '<div class="nav-logo-text">SPEAK</div>'
    )
    html = html.replace(
        '<div class="nav_link-text">Progetti</div>',
        '<div class="nav_link-text">Solutions</div>'
    )
    html = html.replace(
        '<div class="nav_link-text copia">Progetti</div>',
        '<div class="nav_link-text copia">Solutions</div>'
    )
    html = html.replace(
        '<div class="nav_link-text">Servizi</div>',
        '<div class="nav_link-text">Workshops</div>'
    )
    html = html.replace(
        '<div class="nav_link-text copia">Servizi</div>',
        '<div class="nav_link-text copia">Workshops</div>'
    )
    html = html.replace(
        '<span class="magnetic-link__label">About</span>',
        '<span class="magnetic-link__label">Events</span>'
    )
    html = html.replace(
        '<span class="button-043__text">Contattami</span>',
        '<span class="button-043__text">Échanger</span>'
    )

    # 5. Hero H1
    old_h1 = '<h1 data-split-reveal="lines" data-split="hero" class="hero-text">Siti web che funzionano.<br>Per agenzie e brand che non vogliono sorprese.<br><br>Lavoro in tutta Italia per costruire siti web veloci, curati e all&#x27;altezza del brand che rappresentano.</h1>'
    new_h1 = '<h1 data-split-reveal="lines" data-split="hero" class="hero-text">English for the way business moves.<br>Corporate English experiences for professionals, leaders and teams.<br><br>From individual coaching to practical workshops and professional events, Speak connects English with the conversations, decisions and collaborations that matter at work.</h1>'
    html = html.replace(old_h1, new_h1)

    html = html.replace(
        '<div class="bottom_footer-a">web designer based in italy</div>',
        '<div class="bottom_footer-a">corporate english for business & leadership</div>'
    )

    # 6. Sticky Titles
    old_sticky_1 = '<h2 data-sticky-title="heading" class="sticky-title-el">Perché ti serve un sito che funziona davvero?</h2>'
    new_sticky_1 = '<h2 data-sticky-title="heading" class="sticky-title-el">Where English needs to work.</h2>'
    html = html.replace(old_sticky_1, new_sticky_1)

    old_sticky_2 = '<h2 data-sticky-title="heading" class="sticky-title-el is--stacked light">Chi non ti conosce ti cerca online.<br>Se non trova niente, passa oltre.</h2>'
    new_sticky_2 = '<h2 data-sticky-title="heading" class="sticky-title-el is--stacked light">Meetings that need alignment.<br>Presentations that call for clarity.</h2>'
    html = html.replace(old_sticky_2, new_sticky_2)

    old_sticky_3 = '<h2 data-sticky-title="heading" class="sticky-title-el is--stacked _3">Il tuo sito non è solo una vetrina.<br>Lavora per te, 24 ore su 24.</h2>'
    new_sticky_3 = '<h2 data-sticky-title="heading" class="sticky-title-el is--stacked _3">Negotiations that require nuance.<br>Real business conversations.</h2>'
    html = html.replace(old_sticky_3, new_sticky_3)

    # 7. Formats / Cards
    html = html.replace(
        '<div class="label">Lavori recenti</div>',
        '<div class="label">Nos Formats d&#x27;Intervention</div>'
    )

    # Card 1: Executive 1:1 Coaching
    html = html.replace(
        '<h2 class="work_title">Omar Essam</h2>',
        '<h2 class="work_title">Executive 1:1 Coaching</h2>'
    )
    html = html.replace(
        'Fotografo con sede in Italia, il sito mostra particolare attenzione all&#x27;esperienza utente e alla pulizia del design, in modo da lasciar parlare le immagini.',
        'Accompagnement ciblé et confidentiel sur les enjeux d&#x27;un dirigeant ou d&#x27;un professionnel : préparation de négociations, présentations stratégiques et leadership international.'
    )

    # Card 2: Corporate Workshops
    html = html.replace(
        '<h2 class="work_title">Jesuis Vir</h2>',
        '<h2 class="work_title">Corporate Workshops</h2>'
    )
    html = html.replace(
        'Sito web per un brand di costumi da bagno di alta qualità, con un&#x27;estetica che riflette il posizionamento premium del prodotto.<br>Realizzato in collaborazione con Saisei Media.',
        'Mises en pratique collectives sur des situations réelles de travail : structure de meetings, gestion des objections, pitch d&#x27;équipe et communication professionnelle.'
    )

    # Card 3: Speak Events
    html = html.replace(
        '<h2 class="work_title">Luca Maglierie</h2>',
        '<h2 class="work_title">Speak Events</h2>'
    )
    html = html.replace(
        'Landing page per un brand b2b di maglieria di lusso, pensata per comunicare qualità della produzione e affidabilità della filiera.',
        'Rencontres professionnelles, prises de parole et learning experiences exclusives autour de l&#x27;anglais en entreprise et des conversations d&#x27;affaires.'
    )

    # Card 4: Solutions Organisations
    html = html.replace(
        '<h2 class="work_title">Team App</h2>',
        '<h2 class="work_title">Solutions Organisations</h2>'
    )
    html = html.replace(
        'Design e sviluppo SaaS concettuale di collaborazione tra team. Mockup su Figma e sviluppo con CMS su Webflow.',
        'Programmes dédiés aux entreprises et décideurs RH/L&amp;D : harmonisation des pratiques d&#x27;anglais corporate et accompagnement d&#x27;équipes internationales.'
    )

    # Work tags replacement (specific occurrences)
    html = html.replace(
        '<div class="work_tag">Webflow</div>\n                <div class="work_tag">UI / UX</div>',
        '<div class="work_tag">Bespoke</div>\n                <div class="work_tag">Executive</div>'
    )
    html = html.replace(
        '<div class="work_tag">Webflow</div>\n              </div>\n            </div>\n          </div>\n          <div class="work_item is--3',
        '<div class="work_tag">Workshops</div>\n              </div>\n            </div>\n          </div>\n          <div class="work_item is--3'
    )
    html = html.replace(
        '<div class="work_tag">Webflow</div>\n              </div>\n            </div>\n          </div>\n          <div class="work_item is--4',
        '<div class="work_tag">Events</div>\n              </div>\n            </div>\n          </div>\n          <div class="work_item is--4'
    )
    html = html.replace(
        '<div class="work_tag">Webflow</div>\n                <div class="work_tag">UI / UX</div>\n                <div class="work_tag">Concept</div>',
        '<div class="work_tag">Corporate</div>\n                <div class="work_tag">Teams</div>\n                <div class="work_tag">B2B</div>'
    )

    # 8. Services Section
    html = html.replace(
        '<div class="label light">Ecco in cosa posso aiutarti</div>',
        '<div class="label light">Situations de Communication Clés</div>'
    )
    html = html.replace(
        '<div data-service-trigger="0" class="service_list-element">Website Strategy</div>',
        '<div data-service-trigger="0" class="service_list-element">Board Meetings & Alignment</div>'
    )
    html = html.replace(
        '<div data-service-trigger="1" class="service_list-element">Website Design</div>',
        '<div data-service-trigger="1" class="service_list-element">Strategic Presentations & Pitch</div>'
    )
    html = html.replace(
        '<div data-service-trigger="2" class="service_list-element">Website Development</div>',
        '<div data-service-trigger="2" class="service_list-element">High-Stakes Negotiations</div>'
    )
    html = html.replace(
        '<div data-service-trigger="3" class="service_list-element">Immagini e Video</div>',
        '<div data-service-trigger="3" class="service_list-element">Cross-Border Team Collaboration</div>'
    )

    # Slogan
    old_slogan = 'Un solo punto di contatto per tutto il progetto.<br>Nessun passaggio di mano, nessuna informazione che si perde tra un fornitore e l&#x27;altro.<br><br>Dalla strategia iniziale al supporto dopo il lancio, ogni fase serve a un solo obiettivo: un sito che si tiene insieme, funziona, e lavora per te.'
    new_slogan = 'Thoughtful. Practical. Professional.<br><br>L&#x27;anglais est le sujet ; la communication au travail est le bénéfice.<br><br>Aucun cours scolaire, aucune méthode générique. Chaque expérience Speak vise à relier l&#x27;apprentissage aux défis concrets et immédiats de votre entreprise : préparer vos réunions décisives, défendre vos idées et collaborer avec assurance.'
    html = html.replace(old_slogan, new_slogan)

    # 9. FAQ Section
    html = html.replace(
        '<h2 class="faq_title">Le risposte<br>alle domande più comuni.</h2>',
        '<h2 class="faq_title">Les réponses<br>à vos questions sur Speak.</h2>'
    )

    # FAQ 1
    html = html.replace(
        'Cosa mi serve per iniziare a lavorare insieme?',
        'À qui s&#x27;adressent les solutions Speak ?'
    )
    html = html.replace(
        'Parleremo di cosa hai bisogno durante una chiamata conoscitiva per capire il progetto e le tue esigenze. Da lì preparo una proposta su misura. Per iniziare serve la firma del contratto e un acconto. Niente burocrazia inutile, si parte subito.',
        'Aux professionnels, dirigeants, managers, équipes et entreprises qui font de l&#x27;anglais un levier de travail stratégique et souhaitent gagner en précision, aisance et impact lors de leurs échanges décisifs.'
    )

    # FAQ 2
    html = html.replace(
        'Come gestiamo la comunicazione durante il progetto?',
        'Quelle différence entre coaching, workshop et event ?'
    )
    html = html.replace(
        'Lavoro via mail, Whatsapp e videocall. Nessuna piattaforma complicata.<br>Le chiamate vengono principalmente programmate per decisioni importanti, revisioni o aggiornamenti.',
        'Le coaching individuel 1:1 répond à des enjeux personnels et confidentiels. Les corporate workshops sont des sessions collectives pratiques axées sur des cas réels (meetings, pitchs). Les Speak Events sont des rencontres professionnelles autour de conférences et d&#x27;échanges d&#x27;idées.'
    )

    # FAQ 3
    html = html.replace(
        'Puoi lavorare su un progetto già avviato?',
        'Quel niveau d&#x27;anglais faut-il pour participer ?'
    )
    html = html.replace(
        'Se è costruito su Webflow o su una piattaforma con cui lavoro, posso partire da dove sei arrivato.',
        'Il n&#x27;y a pas de niveau scolaire standard exigé. Chaque format s&#x27;adapte aux contextes réels et aux responsabilités professionnelles de chacun, évalués en amont pour garantir une pertinence immédiate au travail.'
    )

    # FAQ 4
    html = html.replace(
        'Qual è l&#x27;investimento necessario per un progetto?',
        'Où se déroulent les séances et événements ?'
    )
    html = html.replace(
        'Una landing page e un sito completo hanno costi molto diversi. Ogni preventivo è costruito sul progetto specifico. Il modo migliore è parlarne, prenota una chiamata per avere una stima in poco tempo!',
        'Nos sessions se tiennent en présentiel à Marrakech, directement dans vos locaux d&#x27;entreprise, ou en distanciel interactif selon le format et les disponibilités de votre équipe.'
    )

    # FAQ 5
    html = html.replace(
        'Lavori solo con Webflow o anche con altri strumenti?',
        'Quels sont les tarifs et les modalités ?'
    )
    html = html.replace(
        'Lavoro principalmente con Webflow, che mi permette di garantire un livello di dettaglio e qualità difficile da replicare con altri strumenti. Per esigenze specifiche valuto anche altre piattaforme in base al progetto.',
        'Nos tarifs sont établis en toute transparence selon le format retenu : accompagnement individuel, participation atelier/event ou devis entreprise dédié. Contactez-nous pour recevoir une proposition adaptée.'
    )

    # FAQ 6
    html = html.replace(
        'Come funziona il servizio di foto e video?',
        'Comment choisir le format adapté à nos objectifs ?'
    )
    html = html.replace(
        'Se hai bisogno di foto o video per il tuo sito, organizziamo insieme un sopralluogo per capire cosa serve e come farlo al meglio. Da lì pianifichiamo lo shooting e si parte.',
        'Échangeons lors d&#x27;un entretien préliminaire pour identifier vos priorités immédiates (prise de parole, négociation, animation d&#x27;équipe) et vous orienter vers la solution la plus pertinente.'
    )

    # 10. CTA Section
    html = html.replace(
        '<div class="cta_text">Hai altre domande?</div>',
        '<div class="cta_text">Un enjeu de communication en anglais ?</div>'
    )
    html = html.replace(
        '<div class="cta_text light">Chiedimi pure.</div>',
        '<div class="cta_text light">Parlons de vos priorités.</div>'
    )
    html = html.replace(
        'Prenota una chiamata',
        'Discuter de vos objectifs'
    )

    # 11. Footer Section
    html = html.replace(
        '<p class="top_footer-p">©2026 Davide Carusio</p>',
        '<p class="top_footer-p">©2026 SPEAK. All rights reserved.</p>'
    )
    html = html.replace(
        '<p class="top_footer-p">P.IVA:03083620355</p>',
        '<p class="top_footer-p">Marrakech · Corporate English Experiences</p>'
    )
    html = html.replace(
        'mailto:davidecarusio92@gmail.com?subject=Richiesta%20di%20contatto%20-%20davidecarusio.it',
        'mailto:contact@speak.ma?subject=Demande%20d%20information%20-%20SPEAK'
    )
    html = html.replace('davidecarusio92@gmail.com', 'contact@speak.ma')
    html = html.replace('<div class="footer_a">Scrivimi</div>', '<div class="footer_a">Nous écrire</div>')
    html = html.replace('<p class="top_footer-p">navigazione</p>', '<p class="top_footer-p">Navigation</p>')
    html = html.replace('<p class="top_footer-p">contatti</p>', '<p class="top_footer-p">Contact</p>')
    html = html.replace('<a class="backtotop-p w-button">Torna su</a>', '<a class="backtotop-p w-button">Haut de page</a>')

    return html

def transform_en(html):
    # 1. Title & Meta
    html = html.replace(
        '<title>Davide Carusio - Web Designer / Webflow Dev</title>',
        '<title>SPEAK | Corporate English, Workshops & Executive Coaching</title>'
    )
    html = html.replace(
        'content="Freelance web designer. High-converting Webflow &amp; WordPress sites built for agencies, brands, and founders. Get a custom quote."',
        'content="Speak helps professionals, leaders and teams communicate more effectively in English at work. Executive coaching, corporate workshops and professional events."'
    )
    html = html.replace(
        'content="Davide Carusio - Web Designer / Webflow Dev"',
        'content="SPEAK | Corporate English, Workshops & Executive Coaching"'
    )

    # 2. Loader Texts
    html = html.replace(
        '<span data-load-text="" data-load-reset="" class="loader__text-el">remember</span><span data-load-text="" data-load-reset="" class="loader__text-el">pizza tastes better in Italy</span>',
        '<span data-load-text="" data-load-reset="" class="loader__text-el">SPEAK</span><span data-load-text="" data-load-reset="" class="loader__text-el">ENGLISH HAPPENS</span>'
    )

    # 3. Cursor
    html = html.replace(
        '<span class="cursor-bubble__text">Visit website</span>',
        '<span class="cursor-bubble__text">Explore</span>'
    )

    # 4. Nav
    html = html.replace(
        '<div class="nav-logo-text">davide carusio</div>',
        '<div class="nav-logo-text">SPEAK</div>'
    )
    html = html.replace(
        '<div class="nav_link-text">Projects</div>',
        '<div class="nav_link-text">Solutions</div>'
    )
    html = html.replace(
        '<div class="nav_link-text copia">Projects</div>',
        '<div class="nav_link-text copia">Solutions</div>'
    )
    html = html.replace(
        '<div class="nav_link-text">Services</div>',
        '<div class="nav_link-text">Workshops</div>'
    )
    html = html.replace(
        '<div class="nav_link-text copia">Services</div>',
        '<div class="nav_link-text copia">Workshops</div>'
    )
    html = html.replace(
        '<span class="magnetic-link__label">About</span>',
        '<span class="magnetic-link__label">Events</span>'
    )
    html = html.replace(
        '<span class="button-043__text">Contact me</span>',
        '<span class="button-043__text">Get in Touch</span>'
    )

    # 5. Hero H1
    old_h1_en = '<h1 data-split-reveal="lines" data-split="hero" class="hero-text">Websites that convert.<br>For agencies &amp; brands that don&#x27;t want surprises.<br><br>I build fast, polished Webflow and WordPress sites that match the quality of the brand they represent.</h1>'
    new_h1_en = '<h1 data-split-reveal="lines" data-split="hero" class="hero-text">English for the way business moves.<br>Corporate English experiences for professionals, leaders and teams.<br><br>From individual coaching to practical workshops and professional events, Speak connects English with the conversations, decisions and collaborations that matter at work.</h1>'
    html = html.replace(old_h1_en, new_h1_en)

    html = html.replace(
        '<div class="bottom_footer-a">web designer based in italy</div>',
        '<div class="bottom_footer-a">corporate english for business & leadership</div>'
    )

    # 6. Sticky Titles
    old_sticky_1_en = '<h2 data-sticky-title="heading" class="sticky-title-el">Why do you need a website that actually converts?</h2>'
    new_sticky_1_en = '<h2 data-sticky-title="heading" class="sticky-title-el">Where English needs to work.</h2>'
    html = html.replace(old_sticky_1_en, new_sticky_1_en)

    old_sticky_2_en = '<h2 data-sticky-title="heading" class="sticky-title-el is--stacked light">People look you up online.<br>If they find nothing, they move on.</h2>'
    new_sticky_2_en = '<h2 data-sticky-title="heading" class="sticky-title-el is--stacked light">Meetings that need alignment.<br>Presentations that call for clarity.</h2>'
    html = html.replace(old_sticky_2_en, new_sticky_2_en)

    old_sticky_3_en = '<h2 data-sticky-title="heading" class="sticky-title-el is--stacked _3">Your website is not just a digital business card.<br>It works for you, around the clock.</h2>'
    new_sticky_3_en = '<h2 data-sticky-title="heading" class="sticky-title-el is--stacked _3">Negotiations that require nuance.<br>Real business conversations.</h2>'
    html = html.replace(old_sticky_3_en, new_sticky_3_en)

    # 7. Formats / Cards
    html = html.replace(
        '<div class="label">Featured work</div>',
        '<div class="label">Our Delivery Formats</div>'
    )

    # Card 1
    html = html.replace(
        '<h2 class="work_title">Omar Essam</h2>',
        '<h2 class="work_title">Executive 1:1 Coaching</h2>'
    )
    html = html.replace(
        'Photographer based in Italy. The website focuses on user experience and clean design, letting the images speak for themselves.',
        'Focused, confidential support on a professional&#x27;s key challenges: high-stakes negotiations, executive presentations, and cross-border leadership.'
    )

    # Card 2
    html = html.replace(
        '<h2 class="work_title">Jesuis Vir</h2>',
        '<h2 class="work_title">Corporate Workshops</h2>'
    )
    html = html.replace(
        'Website for a high-end swimwear brand, with an aesthetic that reflects the premium positioning of the product.<br>Built in collaboration with Saisei Media.',
        'Collaborative group practice around real workplace scenarios: meeting alignment, handling objections, pitching, and professional communication.'
    )

    # Card 3
    html = html.replace(
        '<h2 class="work_title">Luca Maglierie</h2>',
        '<h2 class="work_title">Speak Events</h2>'
    )
    html = html.replace(
        'Landing page for a luxury B2B knitwear brand, designed to communicate production quality and supply chain reliability.',
        'Professional gatherings, keynotes, and immersive learning experiences centered on impactful workplace communication.'
    )

    # Card 4
    html = html.replace(
        '<h2 class="work_title">Team App</h2>',
        '<h2 class="work_title">Solutions for Teams</h2>'
    )
    html = html.replace(
        'Conceptual SaaS design and development for team collaboration. Mockup on Figma, built with CMS on Webflow.',
        'Tailored programs for corporate teams and HR/L&amp;D leaders: aligning international communication practices across global teams.'
    )

    # Work tags
    html = html.replace(
        '<div class="work_tag">Webflow</div>\n                <div class="work_tag">UI / UX</div>',
        '<div class="work_tag">Bespoke</div>\n                <div class="work_tag">Executive</div>'
    )
    html = html.replace(
        '<div class="work_tag">Webflow</div>\n              </div>\n            </div>\n          </div>\n          <div class="work_item is--3',
        '<div class="work_tag">Workshops</div>\n              </div>\n            </div>\n          </div>\n          <div class="work_item is--3'
    )
    html = html.replace(
        '<div class="work_tag">Webflow</div>\n              </div>\n            </div>\n          </div>\n          <div class="work_item is--4',
        '<div class="work_tag">Events</div>\n              </div>\n            </div>\n          </div>\n          <div class="work_item is--4'
    )
    html = html.replace(
        '<div class="work_tag">Webflow</div>\n                <div class="work_tag">UI / UX</div>\n                <div class="work_tag">Concept</div>',
        '<div class="work_tag">Corporate</div>\n                <div class="work_tag">Teams</div>\n                <div class="work_tag">B2B</div>'
    )

    # 8. Services
    html = html.replace(
        '<div class="label light">Here&#x27;s how I can help you</div>',
        '<div class="label light">Key Communication Situations</div>'
    )
    html = html.replace(
        '<div data-service-trigger="0" class="service_list-element">Website Strategy</div>',
        '<div data-service-trigger="0" class="service_list-element">Board Meetings & Alignment</div>'
    )
    html = html.replace(
        '<div data-service-trigger="1" class="service_list-element">Website Design</div>',
        '<div data-service-trigger="1" class="service_list-element">Strategic Presentations & Pitch</div>'
    )
    html = html.replace(
        '<div data-service-trigger="2" class="service_list-element">Website Development</div>',
        '<div data-service-trigger="2" class="service_list-element">High-Stakes Negotiations</div>'
    )
    html = html.replace(
        '<div data-service-trigger="3" class="service_list-element">Images and Videos</div>',
        '<div data-service-trigger="3" class="service_list-element">Cross-Border Team Collaboration</div>'
    )

    old_slogan_en = 'A single point of contact for the entire project.<br>No handoffs, no lost context between different freelancers.<br><br>From initial strategy to post-launch support, every step serves one goal: a website that holds together, looks great, and works for you.'
    new_slogan_en = 'Thoughtful. Practical. Professional.<br><br>English is the subject; communication at work is the benefit.<br><br>No generic school courses, no off-the-shelf formulas. Every Speak experience bridges learning directly with your team&#x27;s real corporate priorities: leading critical conversations, pitching with clarity, and collaborating with executive confidence.'
    html = html.replace(old_slogan_en, new_slogan_en)

    # 9. FAQ
    html = html.replace(
        '<h2 class="faq_title">Answers<br>to common questions.</h2>',
        '<h2 class="faq_title">Frequently Asked Questions<br>about Speak.</h2>'
    )

    html = html.replace(
        'What do I need to get started?',
        'Who are Speak solutions designed for?'
    )
    html = html.replace(
        'We&#x27;ll discuss what you need on a discovery call to understand the project and your goals. From there, I prepare a custom proposal. To start, all that&#x27;s needed is a signed contract and a deposit. No unnecessary bureaucracy, we get straight to work.',
        'Professionals, executives, managers, teams and organizations that use English as a key business tool and want to build precision, clarity, and impact in decisive workplace interactions.'
    )

    html = html.replace(
        'How do we handle communication during the project?',
        'What is the difference between coaching, workshops and events?'
    )
    html = html.replace(
        'I work via email, WhatsApp, and video calls. No complicated platforms.<br>Calls are scheduled for key decisions, reviews, or project milestones.',
        'Individual 1:1 coaching addresses personal and confidential priorities. Corporate workshops provide hands-on group practice on real scenarios (meetings, pitches). Speak Events are gatherings dedicated to inspiring talks and professional dialogue.'
    )

    html = html.replace(
        'Can you work on an existing project?',
        'What level of English is required to participate?'
    )
    html = html.replace(
        'If it&#x27;s built on Webflow or another platform I work with, I can pick up where you left off.',
        'There is no standard school level required. Each format is calibrated around your real workplace responsibilities and assessed beforehand to ensure immediate, actionable relevance.'
    )

    html = html.replace(
        'How much does a project cost?',
        'Where do sessions and events take place?'
    )
    html = html.replace(
        'A landing page and a full website have very different costs. Every quote is built around the specific project. The best way to find out is to talk: book a call to get an estimate quickly.',
        'Sessions are held in Marrakech, on-site at your company headquarters, or via interactive remote sessions depending on your team&#x27;s schedule and location.'
    )

    html = html.replace(
        'Do you only work with Webflow or with other tools too?',
        'What are the pricing terms and engagement options?'
    )
    html = html.replace(
        'I work primarily with Webflow, which allows me to deliver a level of detail and quality that&#x27;s hard to match with other tools. For specific needs, I evaluate other platforms depending on the project.',
        'We operate with transparent pricing based on the chosen format: individual coaching, workshop/event participation, or dedicated enterprise packages. Contact us for a tailored proposal.'
    )

    html = html.replace(
        'How does the photo and video service work?',
        'How do I choose the right format for my team?'
    )
    html = html.replace(
        'If you need photos or video for your website, we arrange a scouting session to figure out what&#x27;s needed and how to do it best. From there, we schedule the shoot and get to work.',
        'We start with an introductory conversation to understand your immediate business objectives (board meetings, negotiations, team alignment) and recommend the most effective pathway.'
    )

    # 10. CTA
    html = html.replace(
        '<div class="cta_text">Still have questions?</div>',
        '<div class="cta_text">Facing an important business conversation?</div>'
    )
    html = html.replace(
        '<div class="cta_text light">Ask away.</div>',
        '<div class="cta_text light">Let&#x27;s discuss your goals.</div>'
    )
    html = html.replace(
        'Book a call',
        'Discuss Your Objectives'
    )

    # 11. Footer
    html = html.replace(
        '<p class="top_footer-p">©2026 Davide Carusio</p>',
        '<p class="top_footer-p">©2026 SPEAK. All rights reserved.</p>'
    )
    html = html.replace(
        '<p class="top_footer-p">VAT ID: 03083620355</p>',
        '<p class="top_footer-p">Marrakech · Corporate English Experiences</p>'
    )
    html = html.replace(
        'mailto:davidecarusio92@gmail.com?subject=Contact%20request%20-%20davidecarusio.it',
        'mailto:contact@speak.ma?subject=Inquiry%20-%20SPEAK'
    )
    html = html.replace('davidecarusio92@gmail.com', 'contact@speak.ma')
    html = html.replace('<div class="footer_a">Write me</div>', '<div class="footer_a">Email Us</div>')
    html = html.replace('<a class="backtotop-p w-button">Back to top</a>', '<a class="backtotop-p w-button">Back to top</a>')

    return html

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        it_html = f.read()
    with open('en/index.html', 'r', encoding='utf-8') as f:
        en_html = f.read()

    it_transformed = transform_it(it_html)
    en_transformed = transform_en(en_html)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(it_transformed)
    with open('en/index.html', 'w', encoding='utf-8') as f:
        f.write(en_transformed)
    with open('en.html', 'w', encoding='utf-8') as f:
        f.write(en_transformed)

    print("Success! index.html length:", len(it_transformed))
    print("Success! en/index.html length:", len(en_transformed))

if __name__ == '__main__':
    main()
