//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DATA
{
    using System;
    using System.Collections.Generic;
    
    public partial class Report
    {
        public int ReportNumber { get; set; }
        public string ReportContent { get; set; }
        public Nullable<System.DateTime> ReportDate { get; set; }
        public Nullable<int> ReportTypeCode { get; set; }
        public string ID { get; set; }
        public string TreatmentType { get; set; }
    
        public virtual User User { get; set; }
        public virtual ReportType ReportType { get; set; }
    }
}
