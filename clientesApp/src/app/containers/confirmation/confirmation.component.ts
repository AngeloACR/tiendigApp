import { Component, OnInit } from "@angular/core";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.scss"]
})
export class ConfirmationComponent implements OnInit {
  confirmation: FormGroup;

  constructor(private wc: WoocommerceService, private common: CommonService) {}

  ngOnInit() {
    this.confirmation = new FormGroup({
      reference: new FormControl(""),
    });
  }

  handleUpload() {
    // Create a root reference
    let orderReference = this.confirmation.value.reference;
    let link = `https://tiendig.com/wp-admin/admin-ajax.php?action=confirmPayment&orderReference=${orderReference}&contentType=false&processData=false`;

    let confirmUpload: any = document.getElementById("confirmFiles");
    var fileList = confirmUpload.files; // The <input type="file" /> field
    let i = 0;
    // Loop through each data and create an array file[] containing our files data.
    // our AJAX identifier
    console.log(fileList);
    let fd = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      let name = "clientFile" + i;
      fd.append(name, fileList[i]);
    }
    let ajax = new XMLHttpRequest();
    ajax.open("POST", link, true);
    ajax.onreadystatechange = function(aEvt) {
      console.log(ajax);
      if (ajax.readyState == 4) {
        if (ajax.status == 200) {
          let response = JSON.parse(ajax.responseText);
          console.log(response);
        } else console.log("Error loading page\n");
      }
    };
    ajax.send(fd);
  }
}
