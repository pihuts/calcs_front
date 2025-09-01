"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BoltConfiguration {
  id: string
  name: string
  rowSpacing: string
  columnSpacing: string
  nRows: string
  nColumns: string
  edgeDistanceVertical: string
  edgeDistanceHorizontal: string
  boltDiameter: string
  boltGrade: string
  angle: string
  connectionType: "bolted"
}

interface GlobalLoads {
  id: string
  name: string
  fx: string
  fy: string
  fz: string
  mx: string
  my: string
  mz: string
  directLoad: string
}

interface Member {
  id: string
  type: "steelpy" | "plate"
  name: string
  sectionClass?: string
  sectionName?: string
  shapeType?: string
  role?: string
  thickness?: string
  width?: string
  clipping?: string
  material: string
  loadingCondition: string
  length: string
}

interface Connection {
  id: string
  name: string
  memberA: Member
  memberB: Member
  componentA: string
  componentB: string
  connectionType: string
  boltConfigurationId: string
  globalLoadsId: string
  overrideAg?: string
}

export default function StructuralCalculationsPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [memberCounter, setMemberCounter] = useState(1)
  const [connections, setConnections] = useState<Connection[]>([])
  const [connectionCounter, setConnectionCounter] = useState(1)
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>("")
  const [boltConfigurations, setBoltConfigurations] = useState<BoltConfiguration[]>([])
  const [boltConfigCounter, setBoltConfigCounter] = useState(1)
  const [globalLoads, setGlobalLoads] = useState<GlobalLoads[]>([])
  const [globalLoadsCounter, setGlobalLoadsCounter] = useState(1)

  const [inputs, setInputs] = useState({
    memberType: "steelpy",
    memberName: "",
    sectionClass: "W_shapes",
    sectionName: "W21X83",
    shapeType: "W",
    role: "BEAM",
    loadingCondition: "1",
    thickness: "0.625",
    width: "10",
    clipping: "0",
    material: "A992",
    length: "25",
    connectionName: "",
    memberA: "",
    memberB: "",
    componentA: "TOTAL",
    componentB: "TOTAL",
    connectionType: "bolted",
    boltConfigurationId: "",
    globalLoadsId: "",
    overrideAg: "",
    boltConfigName: "",
    rowSpacing: "3.0",
    columnSpacing: "3.0",
    nRows: "2",
    nColumns: "7",
    edgeDistanceVertical: "2.0",
    edgeDistanceHorizontal: "1.5",
    boltDiameter: "0.875",
    boltGrade: "A325-X",
    angle: "47.2",
    globalLoadsName: "",
    fx: "0",
    fy: "0",
    fz: "0",
    mx: "0",
    my: "0",
    mz: "0",
    directLoad: "150",
  })

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const addMember = () => {
    const newMember: Member = {
      id: `member-${memberCounter}`,
      type: inputs.memberType as "steelpy" | "plate",
      name: inputs.memberName || `${inputs.memberType === "steelpy" ? inputs.sectionName : "Plate"} ${memberCounter}`,
      material: inputs.material,
      loadingCondition: inputs.loadingCondition,
      length: inputs.length,
    }

    if (inputs.memberType === "steelpy") {
      newMember.sectionClass = inputs.sectionClass
      newMember.sectionName = inputs.sectionName
      newMember.shapeType = inputs.shapeType
      newMember.role = inputs.role
    } else {
      newMember.thickness = inputs.thickness
      newMember.width = inputs.width
      newMember.clipping = inputs.clipping
    }

    setMembers((prev) => [...prev, newMember])
    setMemberCounter((prev) => prev + 1)
    setInputs((prev) => ({ ...prev, memberName: "" }))
  }

  const addBoltConfiguration = () => {
    const newBoltConfig: BoltConfiguration = {
      id: `bolt-config-${boltConfigCounter}`,
      name: inputs.boltConfigName || `Bolt Config ${boltConfigCounter}`,
      rowSpacing: inputs.rowSpacing,
      columnSpacing: inputs.columnSpacing,
      nRows: inputs.nRows,
      nColumns: inputs.nColumns,
      edgeDistanceVertical: inputs.edgeDistanceVertical,
      edgeDistanceHorizontal: inputs.edgeDistanceHorizontal,
      boltDiameter: inputs.boltDiameter,
      boltGrade: inputs.boltGrade,
      angle: inputs.angle,
      connectionType: "bolted",
    }

    setBoltConfigurations((prev) => [...prev, newBoltConfig])
    setBoltConfigCounter((prev) => prev + 1)
    setInputs((prev) => ({ ...prev, boltConfigName: "" }))
  }

  const addGlobalLoads = () => {
    const newGlobalLoads: GlobalLoads = {
      id: `global-loads-${globalLoadsCounter}`,
      name: inputs.globalLoadsName || `Global Loads ${globalLoadsCounter}`,
      fx: inputs.fx,
      fy: inputs.fy,
      fz: inputs.fz,
      mx: inputs.mx,
      my: inputs.my,
      mz: inputs.mz,
      directLoad: inputs.directLoad,
    }

    setGlobalLoads((prev) => [...prev, newGlobalLoads])
    setGlobalLoadsCounter((prev) => prev + 1)
    setInputs((prev) => ({ ...prev, globalLoadsName: "" }))
  }

  const addConnection = () => {
    const memberA = members.find((m) => m.id === inputs.memberA)
    const memberB = members.find((m) => m.id === inputs.memberB)

    if (!memberA || !memberB || !inputs.boltConfigurationId || !inputs.globalLoadsId) {
      alert("Please select all required fields")
      return
    }

    const newConnection: Connection = {
      id: `connection-${connectionCounter}`,
      name: inputs.connectionName || `Connection ${connectionCounter}`,
      memberA,
      memberB,
      componentA: inputs.componentA,
      componentB: inputs.componentB,
      connectionType: inputs.connectionType,
      boltConfigurationId: inputs.boltConfigurationId,
      globalLoadsId: inputs.globalLoadsId,
      overrideAg: inputs.overrideAg || undefined,
    }

    setConnections((prev) => [...prev, newConnection])
    setConnectionCounter((prev) => prev + 1)
    setInputs((prev) => ({ ...prev, connectionName: "", memberA: "", memberB: "" }))
  }

  const calculateConnectionResults = () => {
    const selectedConnection = connections.find((conn) => conn.id === selectedConnectionId)
    if (!selectedConnection) return null

    const selectedGlobalLoads = globalLoads.find((loads) => loads.id === selectedConnection.globalLoadsId)
    const selectedBoltConfig = boltConfigurations.find((config) => config.id === selectedConnection.boltConfigurationId)

    if (!selectedGlobalLoads || !selectedBoltConfig) return null

    const directLoad = Number.parseFloat(selectedGlobalLoads.directLoad) || 0
    const boltDiameter = Number.parseFloat(selectedBoltConfig.boltDiameter) || 0.875
    const nBolts = Number(selectedBoltConfig.nRows) * Number(selectedBoltConfig.nColumns)
    const Fu = 65
    const boltArea = (Math.PI * Math.pow(boltDiameter, 2)) / 4

    return {
      connection: selectedConnection,
      boltConfig: selectedBoltConfig,
      loads: selectedGlobalLoads,
      boltShearCapacity: (nBolts * 0.6 * Fu * boltArea) / 2.0,
      boltTensileCapacity: (nBolts * 0.75 * Fu * boltArea) / 2.0,
      appliedLoad: directLoad,
      utilizationRatio: directLoad / ((nBolts * 0.6 * Fu * boltArea) / 2.0),
      safetyCheck: directLoad <= (nBolts * 0.6 * Fu * boltArea) / 2.0 ? "SAFE" : "UNSAFE",
    }
  }

  const results = calculateConnectionResults()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4 text-foreground text-balance">
            Structural Connection Design Calculator
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto text-pretty">
            Professional engineering calculations for limit states of structural connections
          </p>
        </div>

        {/* Connection Analysis Section */}
        {connections.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-heading font-bold">Connection Analysis</CardTitle>
              <CardDescription>Select a connection to analyze and view detailed calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="selectedConnection">Select Connection to Analyze</Label>
                  <Select value={selectedConnectionId} onValueChange={setSelectedConnectionId}>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Choose a connection for analysis" />
                    </SelectTrigger>
                    <SelectContent>
                      {connections.map((connection) => (
                        <SelectItem key={connection.id} value={connection.id}>
                          {connection.name} ({connection.memberA.name} → {connection.memberB.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {results && (
                  <div className="space-y-6 p-6 bg-muted/30 rounded-lg border">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-heading font-semibold mb-3">Connection Details</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Connection:</strong> {results.connection.name}
                          </p>
                          <p>
                            <strong>Member A:</strong> {results.connection.memberA.name}
                          </p>
                          <p>
                            <strong>Member B:</strong> {results.connection.memberB.name}
                          </p>
                          <p>
                            <strong>Bolt Pattern:</strong> {results.boltConfig.nRows} × {results.boltConfig.nColumns}
                          </p>
                          <p>
                            <strong>Applied Load:</strong> {results.appliedLoad} kip
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold mb-3">Safety Assessment</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Shear Capacity:</strong> {results.boltShearCapacity.toFixed(2)} kip
                          </p>
                          <p>
                            <strong>Utilization:</strong> {(results.utilizationRatio * 100).toFixed(1)}%
                          </p>
                          <Badge variant={results.safetyCheck === "SAFE" ? "default" : "destructive"}>
                            {results.safetyCheck}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Created Items Display */}
        <div className="grid gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Created Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-muted text-center py-4">No members created yet</p>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <span className="font-semibold">{member.name}</span>
                        <span className="text-muted ml-2">
                          {member.type === "steelpy" ? member.sectionName : `Plate ${member.thickness}"`}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMembers((prev) => prev.filter((m) => m.id !== member.id))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Created Connections ({connections.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {connections.length === 0 ? (
                <p className="text-muted text-center py-4">No connections created yet</p>
              ) : (
                <div className="space-y-2">
                  {connections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <span className="font-semibold">{connection.name}</span>
                        <span className="text-muted ml-2">
                          {connection.memberA.name} → {connection.memberB.name}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConnections((prev) => prev.filter((c) => c.id !== connection.id))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Input Forms */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Member Creation */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Member</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="memberName">Member Name</Label>
                  <Input
                    id="memberName"
                    placeholder="e.g., Main Beam"
                    value={inputs.memberName}
                    onChange={(e) => handleInputChange("memberName", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="memberType">Member Type</Label>
                  <Select value={inputs.memberType} onValueChange={(value) => handleInputChange("memberType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="steelpy">Steel Section</SelectItem>
                      <SelectItem value="plate">Custom Plate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inputs.memberType === "steelpy" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sectionName">Section Name</Label>
                      <Select
                        value={inputs.sectionName}
                        onValueChange={(value) => handleInputChange("sectionName", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="W21X83">W21X83</SelectItem>
                          <SelectItem value="W18X76">W18X76</SelectItem>
                          <SelectItem value="W24X94">W24X94</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={inputs.role} onValueChange={(value) => handleInputChange("role", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BEAM">BEAM</SelectItem>
                          <SelectItem value="COLUMN">COLUMN</SelectItem>
                          <SelectItem value="BRACE">BRACE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="thickness">Thickness (in)</Label>
                      <Input
                        id="thickness"
                        value={inputs.thickness}
                        onChange={(e) => handleInputChange("thickness", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width (in)</Label>
                      <Input
                        id="width"
                        value={inputs.width}
                        onChange={(e) => handleInputChange("width", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button onClick={addMember} className="w-full">
                  Add Member
                </Button>
              </CardContent>
            </Card>

            {/* Bolt Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Create Bolt Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="boltConfigName">Configuration Name</Label>
                  <Input
                    id="boltConfigName"
                    placeholder="e.g., Standard 2x7"
                    value={inputs.boltConfigName}
                    onChange={(e) => handleInputChange("boltConfigName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nRows">Rows</Label>
                    <Input
                      id="nRows"
                      type="number"
                      value={inputs.nRows}
                      onChange={(e) => handleInputChange("nRows", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nColumns">Columns</Label>
                    <Input
                      id="nColumns"
                      type="number"
                      value={inputs.nColumns}
                      onChange={(e) => handleInputChange("nColumns", e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={addBoltConfiguration} className="w-full">
                  Add Bolt Configuration
                </Button>
              </CardContent>
            </Card>

            {/* Global Loads */}
            <Card>
              <CardHeader>
                <CardTitle>Create Global Loads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="globalLoadsName">Load Case Name</Label>
                  <Input
                    id="globalLoadsName"
                    placeholder="e.g., Wind Load Case 1"
                    value={inputs.globalLoadsName}
                    onChange={(e) => handleInputChange("globalLoadsName", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="directLoad">Direct Load (kip)</Label>
                  <Input
                    id="directLoad"
                    type="number"
                    value={inputs.directLoad}
                    onChange={(e) => handleInputChange("directLoad", e.target.value)}
                  />
                </div>

                <Button onClick={addGlobalLoads} className="w-full">
                  Add Global Loads
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Connection Creation */}
            <Card>
              <CardHeader>
                <CardTitle>Create Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="connectionName">Connection Name</Label>
                  <Input
                    id="connectionName"
                    placeholder="e.g., Beam-Column Connection"
                    value={inputs.connectionName}
                    onChange={(e) => handleInputChange("connectionName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberA">Member A</Label>
                    <Select value={inputs.memberA} onValueChange={(value) => handleInputChange("memberA", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Member A" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="memberB">Member B</Label>
                    <Select value={inputs.memberB} onValueChange={(value) => handleInputChange("memberB", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Member B" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="boltConfigurationId">Bolt Configuration</Label>
                    <Select
                      value={inputs.boltConfigurationId}
                      onValueChange={(value) => handleInputChange("boltConfigurationId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bolt config" />
                      </SelectTrigger>
                      <SelectContent>
                        {boltConfigurations.map((config) => (
                          <SelectItem key={config.id} value={config.id}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="globalLoadsId">Global Loads</Label>
                    <Select
                      value={inputs.globalLoadsId}
                      onValueChange={(value) => handleInputChange("globalLoadsId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select loads" />
                      </SelectTrigger>
                      <SelectContent>
                        {globalLoads.map((loads) => (
                          <SelectItem key={loads.id} value={loads.id}>
                            {loads.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={addConnection} className="w-full">
                  Create Connection
                </Button>
              </CardContent>
            </Card>

            {/* Design Formulas Reference */}
            <Card>
              <CardHeader>
                <CardTitle>Design Formulas Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Bolt Shear Capacity</h4>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    V<sub>r</sub> = n × 0.6 × F<sub>u</sub> × (πd²/4) × (1/γ<sub>s</sub>)
                  </div>
                  <p className="text-sm text-muted mt-1">
                    Where: n = number of bolts, F<sub>u</sub> = ultimate tensile strength
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Bolt Tensile Capacity</h4>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    T<sub>r</sub> = n × 0.75 × F<sub>u</sub> × A<sub>s</sub> × (1/γ<sub>s</sub>)
                  </div>
                  <p className="text-sm text-muted mt-1">
                    Where: A<sub>s</sub> = stress area of bolt thread
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
