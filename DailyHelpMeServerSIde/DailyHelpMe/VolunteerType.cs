//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DailyHelpMe
{
    using System;
    using System.Collections.Generic;
    
    public partial class VolunteerType
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public VolunteerType()
        {
            this.TaskTypes = new HashSet<TaskTypes>();
            this.VolTypesPreferences = new HashSet<VolTypesPreferences>();
        }
    
        public int VolunteerCode { get; set; }
        public string VolunteerName { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TaskTypes> TaskTypes { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<VolTypesPreferences> VolTypesPreferences { get; set; }
    }
}