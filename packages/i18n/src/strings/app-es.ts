import type { AppStringsKeys } from '.'

export const appStringsSpanish: Record<AppStringsKeys, string | null> = {
    loginWithSocialAccount: 'Iniciar sesión con cuenta social',
    welcomeBack: 'Bienvenido de nuevo',
    loginWith: 'Iniciar sesión con',
    createOrganization: 'Crear organización',
    joinExistingOrganization: 'Unirse a una organización existente',
    noPendingInvitations: 'No tienes invitaciones pendientes',
    logout: 'Cerrar sesión',
    myAccount: 'Mi cuenta',
    slugErrorMessage: 'Debe tener entre 4 y 56 caracteres, y solo contener letras, números y guiones',
    nameErrorMessage: 'Debe tener entre 1 y 255 caracteres',
    newTicket: 'Nuevo ticket',
    noTickets: 'Sin tickets',
    noActiveTickets: 'Sin tickets activos',
    theme: 'Tema',
    home: 'Inicio',
    newChannel: 'Nuevo canal',
    nothingHere: 'No hay nada aquí',
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    leaveComment: 'Dejar un comentario',
    addDescription: 'Agregar descripción',
    ticketTitle: 'Título del ticket',
    saveComment: 'Comentar',
    comment: 'Comentario',
    pageNotFound: 'Página no encontrada',
    pageNotFoundDescription: 'La página que buscas no existe o puede que haya sido movida.',
    goHome: 'Ir al inicio',

    // Generic actions & status
    delete: 'Eliminar',
    remove: 'Eliminar',
    saveChanges: 'Guardar cambios',
    discard: 'Descartar',
    saving: 'Guardando…',
    deleting: 'Eliminando…',
    removing: 'Eliminando…',
    unsavedChanges: 'Tienes cambios sin guardar',
    allChangesSaved: 'Todos los cambios guardados',
    somethingWentWrong: 'Algo salió mal. Inténtalo de nuevo.',
    organizationNotFound: 'Organización no encontrada',
    channelNotFound: 'Canal no encontrado',
    identifierLengthError: 'El identificador debe tener entre 4 y 56 caracteres, usando solo letras minúsculas, números y guiones.',
    nameLengthError: 'El nombre debe tener entre 1 y 255 caracteres.',

    // Common field labels
    nameLabel: 'Nombre',
    identifierLabel: 'Identificador',
    detailsTitle: 'Detalles',
    nameFieldDescription: 'El nombre que se muestra en toda la app.',

    // Danger zone (shared)
    dangerZone: 'Zona de peligro',
    dangerZoneDescription: 'Acciones irreversibles. Procede con precaución.',
    confirmDeletePrefix: 'Esta acción es irreversible. Escribe el identificador',
    confirmDeleteSuffix: 'para confirmar.',

    // Channel permission option titles (shared between org settings and channel manage)
    permCreateNew: 'Crear nuevos canales',
    permViewAll: 'Ver todos los tickets',
    permCommentAll: 'Comentar en todos los tickets',
    permCommentOwn: 'Comentar en tickets propios',
    permCommentAssigned: 'Comentar en tickets asignados',
    permManageAll: 'Gestionar todos los tickets',
    permManageOwn: 'Gestionar tickets propios',
    permManageAssigned: 'Gestionar tickets asignados',
    permFullAdmin: 'Administrador total',

    // Permission descriptions (shared)
    permCreateNewDescription: 'Los miembros pueden crear nuevos canales en esta organización.',
    permCommentOwnDescription: 'Los miembros pueden comentar en los tickets que crearon.',
    permCommentAssignedDescription: 'Los miembros pueden comentar en los tickets asignados a ellos.',
    permManageAllDescription: 'Los miembros pueden editar, asignar y cambiar el estado de cualquier ticket.',
    permManageOwnDescription: 'Los miembros pueden gestionar los tickets que crearon.',
    permManageAssignedDescription: 'Los miembros pueden gestionar los tickets asignados a ellos.',

    // Permission descriptions (organization defaults variant)
    orgViewAllDescription: 'Los miembros pueden ver todos los tickets de un canal, no solo los suyos.',
    orgCommentAllDescription: 'Los miembros pueden comentar en cualquier ticket de un canal.',
    orgFullAdminDescription: 'Otorga a los miembros acceso administrativo total dentro de los canales.',

    // Permission descriptions (single channel variant)
    channelViewAllDescription: 'Los miembros pueden ver todos los tickets de este canal, no solo los suyos.',
    channelCommentAllDescription: 'Los miembros pueden comentar en cualquier ticket de este canal.',
    channelFullAdminDescription: 'Otorga a los miembros acceso administrativo total dentro de este canal.',

    // Organization settings screen
    settingsTitle: 'Configuración',
    settingsSubtitle: 'Gestiona los detalles de {name} y los valores predeterminados aplicados a sus canales.',
    orgAdminAccessRequired: 'Necesitas acceso de administrador para cambiar esta configuración.',
    orgDetailsDescription: 'Información básica sobre tu organización.',
    orgIdentifierDescription: 'Se usa en las URLs de esta organización y debe ser único. Cambiarlo actualiza los enlaces existentes.',
    orgNamePlaceholder: 'Mi Empresa',
    defaultChannelOptionsTitle: 'Opciones predeterminadas de canal',
    defaultChannelOptionsDescription: 'Valores aplicados a los canales nuevos. Cada canal puede anularlos individualmente.',
    deleteOrgTitle: 'Eliminar esta organización',
    deleteOrgDescription:
        'Elimina permanentemente la organización y todos sus canales, tickets, comentarios y miembros. Esto no se puede deshacer.',
    deleteOrgDialogTitle: 'Eliminar organización',

    // Members screen
    membersTitle: 'Miembros',
    membersSubtitle: 'Personas con acceso a {name}.',
    onePersonHasAccess: '1 persona tiene acceso.',
    nPeopleHaveAccess: '{count} personas tienen acceso.',
    you: 'Tú',
    role: 'Rol',
    roleOwner: 'Propietario',
    roleAdmin: 'Administrador',
    roleMember: 'Miembro',
    removeFromOrganization: 'Eliminar de la organización',
    removeMemberTitle: 'Eliminar miembro',
    removeMemberConfirmPrefix: 'Eliminar a',
    removeMemberConfirmSuffix:
        'de {orgName}? Perderá el acceso a todos los canales de esta organización. Esto no elimina los tickets ni los comentarios que creó.',

    // Channel manage screen
    channelAdminAccessRequired: 'Necesitas acceso de administrador para gestionar este canal',
    manageChannelTitle: 'Gestionar canal',
    manageChannelSubtitle: 'Configura los detalles de {name} y quién puede hacer qué dentro de él.',
    channelDetailsDescription: 'Información básica sobre este canal.',
    channelIdentifierDescription: 'Se usa en las URLs de este canal y debe ser único. Cambiarlo actualiza los enlaces existentes.',
    channelNamePlaceholder: 'Mi Canal',
    visibilityTitle: 'Visibilidad',
    visibilityDescription: 'Controla quién puede descubrir este canal.',
    publicChannelTitle: 'Canal público',
    publicChannelDescription: 'Cualquiera en la organización puede encontrar y abrir este canal.',
    memberPermissionsTitle: 'Permisos de miembros',
    memberPermissionsDescription:
        'Anula los valores predeterminados de la organización para este canal. «Heredar» mantiene el ajuste de toda la organización.',
    inherit: 'Heredar',
    allow: 'Permitir',
    deny: 'Denegar',
    inheritedValue: 'Heredado: {value}',
    deleteChannelTitle: 'Eliminar este canal',
    deleteChannelDescription: 'Elimina permanentemente el canal y todos sus tickets y comentarios. Esto no se puede deshacer.',
    deleteChannelDialogTitle: 'Eliminar canal',

    // Menu sections
    channelSection: 'Canal',
    organizationSection: 'Organización',
    manage: 'Gestionar',

    // Error screen
    appCrashed: 'La app se bloqueó. Intenta recargar.',

    // Organization home
    noChannels: 'Sin canales',
    useSidebarToCreateChannel: 'Usa la barra lateral para crear un nuevo canal',

    // Ticket screen
    ticketNotFound: 'Ticket no encontrado',
    activity: 'Actividad',

    // User dropdown
    language: 'Idioma',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    themeSystem: 'Sistema',

    // Dialog / sheet
    close: 'Cerrar',

    // Invitations (admin side, on the members screen)
    inviteAction: 'Invitar',
    invitePeopleTitle: 'Invitar personas',
    invitePeopleDescription: 'Invita a alguien a {name} por correo. Verá la invitación la próxima vez que inicie sesión.',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'nombre@ejemplo.com',
    sendInvite: 'Enviar invitación',
    sending: 'Enviando…',
    pendingInvitationsTitle: 'Invitaciones pendientes',
    onePendingInvitation: '1 invitación esperando respuesta.',
    nPendingInvitations: '{count} invitaciones esperando respuesta.',
    noPendingOrgInvitations: 'No hay invitaciones pendientes.',
    invitedAs: 'Invitado como {role}',
    revoke: 'Revocar',

    // Invitations (invitee side)
    invitationsTitle: 'Invitaciones',
    invitationsSubtitle: 'Organizaciones que te han invitado a unirte.',
    invitedToJoinAs: 'Te han invitado a unirte como {role}.',
    invitedByLine: 'Invitado por {name}',
    accept: 'Aceptar',
    decline: 'Rechazar',
    accepting: 'Uniéndote…',
    declining: 'Rechazando…',

    // Leave organization (settings danger zone)
    leaveOrgTitle: 'Salir de esta organización',
    leaveOrgDescription: 'Perderás acceso a todos sus canales. Podrás ser invitado de nuevo más tarde.',
    leaveOrgAction: 'Salir de la organización',
    leaveOrgSoleOwnerHint: 'Eres el único propietario. Haz propietario a alguien más, o elimina la organización, antes de poder salir.',
    leaveOrgConfirm: '¿Seguro que quieres salir de {name}? Perderás acceso a todos sus canales.',
    leaving: 'Saliendo…',
    leave: 'Salir',

    // Channel members screen
    channelMembersTitle: 'Miembros del canal',
    channelMembersSubtitle: 'Quién puede acceder a {name} y qué puede hacer dentro de él.',
    channelMembersEmpty: 'Todavía no se ha agregado a nadie a este canal.',
    channelPublicMembersHint: 'Este canal es público, así que cualquiera en la organización también puede abrirlo.',
    addMember: 'Agregar miembro',
    addMemberDescription: 'Agrega un miembro de la organización a {name}.',
    noOrgMembersToAdd: 'Todos en la organización ya están en este canal.',
    add: 'Agregar',
    adding: 'Agregando…',
    removeFromChannel: 'Quitar del canal',
    removeFromChannelConfirm: '¿Quitar a {name} de este canal? Si el canal es público, todavía podrá abrirlo.',
    editPermissions: 'Editar permisos',
    editPermissionsFor: 'Permisos de {name}',
    editPermissionsDescription:
        'Anula los valores predeterminados de este canal para este miembro. «Heredar» mantiene el ajuste del canal o de la organización.',
}
