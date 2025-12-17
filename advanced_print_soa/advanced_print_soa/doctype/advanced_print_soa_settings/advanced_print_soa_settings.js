// Copyright (c) 2025, dullaba and contributors
// For license information, please see license.txt

frappe.ui.form.on("Advanced Print SOA Settings", {
	refresh(frm) {
        
	},
});
frappe.ui.form.on("Advanced Print SOA Settings Details", {
    ref_doctype(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (!row.ref_doctype) return;

        frappe.call({
            method: "frappe.desk.form.load.getdoctype",
            args: { doctype: row.ref_doctype, with_parent: 1 },
            callback: function (r) {
                if (!r.docs || !r.docs.length) return;

                let meta = r.docs[0];

                const excluded_types = [
                    "Column Break", "Section Break", "Tab Break",
                    "HTML", "Table", "Table MultiSelect",
                    "Fold", "Heading", "Button", "Image"
                ];

                // Prepare options: label -> value mapping
                let options = meta.fields
                    .filter(df => df.fieldname && !excluded_types.includes(df.fieldtype))
                    .map(df => {
                        return {
                            label: `${df.label} (${df.fieldname})`,
                            value: df.fieldname
                        };
                    });

                let child_field = frm.fields_dict["advanced_print_soa_settings_details"]
                    .grid
                    .grid_rows_by_docname[cdn]
                    .get_field("ref_field");

                if (child_field && child_field.df) {
                    // Assign options as array of {label, value}
                    child_field.df.options = options;
                    child_field.refresh();
                } else {
                    console.error("ref_field not found in grid row!");
                }

                frm.refresh_field("advanced_print_soa_settings_details");
            }
        });
    }
});









