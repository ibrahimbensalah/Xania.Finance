﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Xania.DbMigrator.Properties {
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "15.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Resources {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Resources() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("Xania.DbMigrator.Properties.Resources", typeof(Resources).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to CREATE TABLE [dbo].[DbMigrationHistory]
        ///(
        ///	[Id] NCHAR(100) NOT NULL, 
        ///	[Date] DATETIME NOT NULL, 
        ///	[Script] TEXT NOT NULL, 
        ///	CONSTRAINT [PK_DbMigrationHistory] PRIMARY KEY ([Id])
        ///).
        /// </summary>
        internal static string DbMigrationHistory {
            get {
                return ResourceManager.GetString("DbMigrationHistory", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to declare @n char(1)
        ///set @n = char(10)
        ///
        ///declare @stmt nvarchar(max)
        ///
        ///-- procedures
        ///select @stmt = isnull( @stmt + @n, &apos;&apos; ) +
        ///    &apos;drop procedure [&apos; + schema_name(schema_id) + &apos;].[&apos; + name + &apos;]&apos;
        ///from sys.procedures
        ///where is_ms_shipped = 0
        ///
        ///
        ///-- check constraints
        ///select @stmt = isnull( @stmt + @n, &apos;&apos; ) +
        ///&apos;alter table [&apos; + schema_name(schema_id) + &apos;].[&apos; + object_name( parent_object_id ) + &apos;]    drop constraint [&apos; + name + &apos;]&apos;
        ///from sys.check_constraints
        ///where is_ms_shipped = 0
        ///
        ///-- functions
        ///sele [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string truncate_db {
            get {
                return ResourceManager.GetString("truncate_db", resourceCulture);
            }
        }
    }
}
