import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { ContractorService } from '../../../service/contractor.service';
import { TeamModel } from 'app/modules/auth/model/user-model';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { AssignmentUser, AssignmentType } from '../../../models/assignment-user.model';
import { AssignmentTypeEnumCode } from 'app/layout/common/enums/userEnum/typeAssignmentenum';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-contractor-payment',
  templateUrl: './assignment-user.component.html',
  styleUrls: ['./assignment-user.component.scss'],
  animations: fuseAnimations
})

export class AssignmentUserComponent implements OnInit {
  users: TeamModel[] = [];
  juridics: TeamModel[] = [];
  supervisors: TeamModel[] = [];
  supervisorSelected: AssignmentUser = null;
  contracts: any;
  userSelected: AssignmentUser[] = [];
  showSupervisors: boolean = false;
  showContractual: boolean = false;
  showJuridic: boolean = false;
  assignmentUser: AssignmentUser[] = []
  typesAssignment: AssignmentType[] = [];
  contractSelected: string = null;
  typeAsignmentSelected: string = null;
  userPrincipalSelected: AssignmentUser = null;
  juridicPrincipalSelected: AssignmentUser = null;
  private readonly _unsubscribe$ = new Subject<void>();
  showUsers: boolean = false;

  constructor(private _contractorService: ContractorService,
    private ref: ChangeDetectorRef,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<AssignmentUserComponent>,
    _authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) {}

  ngOnInit(): void {
    this.contracts = this.datos.contracts;
    this.getContractorPayment();
    this.getTypeAssigment();
  }

  async addAssignmentUsers() {
    if(this.contractSelected == null){
      Swal.fire('', 'selecciona  un contrato!', 'warning');
    } else if(this.userSelected.length == 0 &&  this.supervisorSelected == null && this.userPrincipalSelected == null){
      Swal.fire('', 'Falta información necesaria para la asignación!', 'warning');
    }else{
      if(this.userSelected.length > 0){
        this.assignmentUser = this.userSelected;
      }
      if(this.supervisorSelected != null){
        this.assignmentUser.push(this.supervisorSelected);
      }
      if(this.userPrincipalSelected != null){
        this.assignmentUser.push(this.userPrincipalSelected);
      }
      if(this.juridicPrincipalSelected != null){
        this.assignmentUser.push(this.juridicPrincipalSelected);
      }
      this.assignmentUser = this.assignmentUser.map((assignment) => ({
        ...assignment,
        contractId: this.contractSelected,
    }));
      this._contractorService
        .assignmentUser(this.assignmentUser)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((res) => {
          if(res.success){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '',
              html: 'Usuarios asignados correctamente!',
              showConfirmButton: false,
              timer: 1500
            });
          }
          this.assignmentUser = [];
        },
          (response) => {
            Swal.fire('Error', 'No se pudo asignar la información!', 'error');
            console.log(response);
          });
    }

  }

  closePopup(): void {
    this.matDialogRef.close();
  }

  getContractorPayment() {
    this._auth.getTeams()
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((Response: TeamModel[]) => {
      this.users = Response.filter(f => f.rollCode == CodeUser.RECRUITER || f.rollCode == CodeUser.SUPERVISORAREAC);
      this.supervisors = Response.filter(f => f.rollCode == CodeUser.SUPERVISOR);
      this.juridics = Response.filter(f => f.rollCode == CodeUser.JURIDICO);
      if(this.users.length == 0 && this.supervisors.length ==0){
        Swal.fire('', 'No hay usuarios con roles Asignados!', 'warning');
      }
      if(this.users.length == 0){
        Swal.fire('', 'No hay contractuales Registrados!', 'warning');
      }else{
        this.showContractual = true;
      }
      if( this.supervisors.length ==0){
        Swal.fire('', 'No hay supervisores registrados!', 'warning');
      }else{
        this.showSupervisors = true;
      }

    });
  }
  assignmentUserselectedPrincipal(event: any,usuario: any) {
    this.findUser(usuario.id,'Principal Contractual',1);

    let assignmwntUser: AssignmentUser = {
      contractId: this.contractSelected,
      userId: usuario.id,
      assignmentType: this.typesAssignment.find(f => f.code === AssignmentTypeEnumCode.RESPONSABLECONTRATOCODE).id
    }
    this.userPrincipalSelected = assignmwntUser;
    let indexUser = this.userSelected.findIndex(f => f.userId ==usuario.id)
    if(indexUser == -1){
      this.userSelected.push(assignmwntUser);
    }else{
      this.userSelected.splice(indexUser, 1);
    }

  }

  assignmentUserselectedSecond(event: any,usuario: any) {
    if(event.checked){

    }
    this.findUser(usuario.id,'Second Contractual',2);

    let assignmwntUser: AssignmentUser = {
      contractId: this.contractSelected,
      userId: usuario.id,
      assignmentType: this.typesAssignment.find(f => f.code === AssignmentTypeEnumCode.APOYORESPONSABLECONTRATO).id
    }
    let indexUser = this.userSelected.findIndex(f => f.userId ==usuario.id)

    if(indexUser < 0){
      this.userSelected.push(assignmwntUser);
    }else{
      this.userSelected.splice(indexUser, 1);
    }
  }
  onChangeAdmin(supervisor: any) {
    let assignmwntUser: AssignmentUser = {
      contractId: this.contractSelected,
      userId: supervisor.id,
      assignmentType: this.typesAssignment.find(f => f.code === AssignmentTypeEnumCode.SUPERVISORCONTRATOCODE).id
    }
    this.supervisorSelected = assignmwntUser;

  }
  selectionChageContract(contract: any) {
    this.showUsers = true;
    this.contractSelected = contract.value;
  }

  selectionChageTypeAssigment(contract: any) {
    this.typeAsignmentSelected = contract.value;
  }
  private getTypeAssigment() {
    this._contractorService.getAssignmentType()
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((Response: AssignmentType[]) => {
      if(Response.length > 0){
        this.typesAssignment = Response;
      }else{
        Swal.fire('', 'No es posible asignar información sin tipos de asignaciones!', 'warning');
        this.closePopup();
      }

    });
  }

  assignmentJuridicselectedPrincipal(usuario: any) {
    this.findUserJuridic(usuario.id,'Principal Juridic',1);
    let assignmwntUser: AssignmentUser = {
      contractId: this.contractSelected,
      userId: usuario.id,
      assignmentType: this.typesAssignment.find(f => f.code === AssignmentTypeEnumCode.JIRIDICOCONTRATOCODE).id
    }
    this.juridicPrincipalSelected = assignmwntUser;
  }

  assignmentJuridicSelectedSecond(usuario: any) {
    this.findUserJuridic(usuario.id,'Second Juridic',2);
    let assignmwntUser: AssignmentUser = {
      contractId: this.contractSelected,
      userId: usuario.id,
      assignmentType: this.typesAssignment.find(f => f.code === AssignmentTypeEnumCode.APOYOJURIDICOCONTRATO).id
    }
    let indexUser = this.userSelected.findIndex(f => f.userId ==usuario.id)
    if(indexUser < 0){
      this.userSelected.push(assignmwntUser);
    }
  }

  private findUser(id: string, type: string, level: number){
    if(level == 1){
      var index = this.users.findIndex(f => f.asign == type && f.id == id);
      if(index >= 0){
        this.users[index].asign = '';
      }else{
        var indexUserType = this.users.findIndex(f => f.asign == type);
        var indexUser = this.users.findIndex(f => f.id == id);
        if(indexUserType >= 0){
          this.users[indexUserType].asign = '';
        }
        this.users[indexUser].asign = type;
      }
    }else{
      var index2 = this.users.findIndex(f => f.id == id && f.asign == type);
      if(index2 >=0){
        this.users[index2].asign = '';
      }else{
        var indexId = this.users.findIndex(f => f.id == id);
        this.users[indexId].asign = type;
      }
    }


  }

  private findUserJuridic(id: string, type: string, level: number){
    if(level == 1){
      var index = this.juridics.findIndex(f => f.asign == type && f.id == id);
      if(index >= 0){
        this.juridics[index].asign = '';
      }else{
        var indexUserType = this.juridics.findIndex(f => f.asign == type);
        var indexUser = this.juridics.findIndex(f => f.id == id);
        if(indexUserType >= 0){
          this.juridics[indexUserType].asign = '';
        }
        this.juridics[indexUser].asign = type;
      }
    }else{
      var index2 = this.juridics.findIndex(f => f.id == id && f.asign == type);
      if(index2 >=0){
        this.juridics[index2].asign = '';
      }else{
        var indexId = this.juridics.findIndex(f => f.id == id);
        this.juridics[indexId].asign = type;
      }
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }

}

